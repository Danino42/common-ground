from fastapi import APIRouter, HTTPException
from app.database import games
from app.models import GameCreate, PlayerJoin
import random
import string

router = APIRouter()

def generate_lobby_code():
    return ''.join(random.choices(string.ascii_uppercase, k=6))

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
    }
    await games.insert_one(game)
    return {"lobby_code": lobby_code}

@router.get("/{lobby_code}")
async def get_game(lobby_code: str):
    game = await games.find_one({"lobby_code": lobby_code})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    game["id"] = str(game["_id"])
    del game["_id"]
    return game

@router.post("/join")
async def join_game(data: PlayerJoin):
    game = await games.find_one({"lobby_code": data.lobby_code})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    if game["status"] != "waiting":
        raise HTTPException(status_code=400, detail="Game already started")

    player = {"name": data.name, "id": str(len(game["players"]) + 1)}
    await games.update_one(
        {"lobby_code": data.lobby_code},
        {"$push": {"players": player}}
    )
    return {"message": f"Joined game {data.lobby_code}", "player": player}