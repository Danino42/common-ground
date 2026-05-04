from fastapi import APIRouter, HTTPException
from app.database import games
from app.models import GameCreate, PlayerJoin, CardAnswer
import random
import string

from pydantic import BaseModel
from typing import List

router = APIRouter()

def generate_lobby_code():
    return ''.join(random.choices(string.ascii_uppercase, k=6))

def generate_player_id(lobby_code: str, name: str, existing_players: list) -> str:
    base_id = f"{lobby_code}-{name}"
    existing_ids = [p["player_id"] for p in existing_players]
    if base_id not in existing_ids:
        return base_id
    counter = 1
    while f"{base_id}-{counter}" in existing_ids:
        counter += 1
    return f"{base_id}-{counter}"

@router.post("/create")
async def create_game(data: GameCreate, facilitator_email: str):
    lobby_code = generate_lobby_code()
    game = {
        "lobby_code": lobby_code,
        "card_set_id": data.card_set_id,
        "max_players": data.max_players,
        "facilitator_email": facilitator_email,
        "status": "waiting",
        "current_card_index": 0,
        "players": [],
        "answers": {},
    }
    await games.insert_one(game)
    return {"lobby_code": lobby_code}

@router.post("/join")
async def join_game(data: PlayerJoin):
    game = await games.find_one({"lobby_code": data.lobby_code})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    if game["status"] != "waiting":
        raise HTTPException(status_code=400, detail="Game already started")

    player_id = generate_player_id(data.lobby_code, data.name, game["players"])
    player = {
        "player_id": player_id,
        "name": data.name,
        "finished": False,
    }

    await games.update_one(
        {"lobby_code": data.lobby_code},
        {
            "$push": {"players": player},
            "$set": {f"answers.{player_id}": {}},
        }
    )
    return {"player_id": player_id, "name": data.name}

@router.post("/answer")
async def submit_answer(data: CardAnswer):
    game = await games.find_one({"lobby_code": data.lobby_code})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    await games.update_one(
        {"lobby_code": data.lobby_code},
        {"$set": {f"answers.{data.player_id}.{data.card_id}": data.answer}},
    )
    return {"status": "ok"}

@router.get("/{lobby_code}/results")
async def get_results(lobby_code: str):
    game = await games.find_one({"lobby_code": lobby_code})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    answers = game.get("answers", {})
    card_set_id = game.get("card_set_id")

    results = {}
    for player_id, player_answers in answers.items():
        for card_id, answer in player_answers.items():
            if card_id not in results:
                results[card_id] = {"yes": 0, "no": 0}
            if answer is True:
                results[card_id]["yes"] += 1
            elif answer is False:
                results[card_id]["no"] += 1

    return {
        "lobby_code": lobby_code,
        "card_set_id": card_set_id,
        "players": game.get("players", []),
        "answers": game.get("answers", {}),
        "results": results,
    }

@router.get("/{lobby_code}")
async def get_game(lobby_code: str):
    game = await games.find_one({"lobby_code": lobby_code})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    game["id"] = str(game["_id"])
    del game["_id"]
    return game

@router.patch("/{lobby_code}/player/{player_id}/finished")
async def mark_finished(lobby_code: str, player_id: str):
    await games.update_one(
        {"lobby_code": lobby_code, "players.player_id": player_id},
        {"$set": {"players.$.finished": True}}
    )
    return {"status": "ok"}

@router.patch("/{lobby_code}/start")
async def start_game(lobby_code: str, card_set_id: str, randomize: bool = False):
    await games.update_one(
        {"lobby_code": lobby_code},
        {"$set": {
            "status": "started",
            "card_set_id": card_set_id,
            "randomize_deck": randomize,
        }}
    )
    return {"status": "started"}

@router.get("/{lobby_code}/players-with-answers")
async def get_players_with_answers(lobby_code: str):
    game = await games.find_one({"lobby_code": lobby_code})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return {
        "players": game.get("players", []),
        "answers": game.get("answers", {}),
    }

class GroupsPayload(BaseModel):
    groups: List[List[str]]  # list of groups, each group is a list of player_ids

@router.patch("/{lobby_code}/groups")
async def save_groups(lobby_code: str, data: GroupsPayload):
    await games.update_one(
        {"lobby_code": lobby_code},
        {"$set": {"groups": data.groups}}
    )
    return {"status": "ok"}