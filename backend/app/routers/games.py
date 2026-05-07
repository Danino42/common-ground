from fastapi import APIRouter, HTTPException
from app.database import db, games
from app.models import GameCreate, PlayerJoin, CardAnswer
import random
import string
from bson import ObjectId

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
        "card_set_id": game.get("card_set_id"),
        "cards": game.get("cards", []),  # ← now included
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
    try:
        card_set = await db["card_sets"].find_one({"_id": ObjectId(card_set_id)})
    except Exception:
        card_set = None

    if not card_set:
        raise HTTPException(status_code=404, detail="Card set not found")

    cards = card_set["cards"].copy()
    if randomize:
        random.shuffle(cards)

    # Reset all players' finished status when game starts
    game = await games.find_one({"lobby_code": lobby_code})
    reset_players = [
        {**p, "finished": False}
        for p in game.get("players", [])
    ]

    await games.update_one(
        {"lobby_code": lobby_code},
        {"$set": {
            "status": "started",
            "card_set_id": card_set_id,
            "card_set_name": card_set["name"],
            "cards": cards,
            "randomize_deck": randomize,
            "players": reset_players,  # ← reset finished flags
            "answers": {},  # ← also reset answers
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

class GroupRequest(BaseModel):
    method: str = "random"  # "random", "similarities", "opposites"
    group_size: int = 3

@router.post("/{lobby_code}/generate-groups")
async def generate_groups(lobby_code: str, data: GroupRequest):
    game = await games.find_one({"lobby_code": lobby_code})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    players = game.get("players", [])
    answers = game.get("answers", {})
    cards = game.get("cards", [])
    card_ids = [c["id"] for c in cards]

    if not players:
        return {"groups": []}

    player_ids = [p["player_id"] for p in players]

    if data.method == "random":
        import random
        shuffled = player_ids.copy()
        random.shuffle(shuffled)
        groups = _split_into_groups(shuffled, data.group_size)
        return {"groups": groups}

    # Build answer vectors — unanswered cards get None
    vectors: dict[str, list] = {}
    for pid in player_ids:
        player_answers = answers.get(pid, {})
        vectors[pid] = [player_answers.get(cid) for cid in card_ids]

    # Compute pairwise scores
    def score(a: str, b: str) -> float:
        va, vb = vectors[a], vectors[b]
        matches = mismatches = 0
        for x, y in zip(va, vb):
            if x is None or y is None:
                continue  # skip unanswered
            if x == y:
                matches += 1
            else:
                mismatches += 1
        total = matches + mismatches
        if total == 0:
            return 0.5  # no overlap — treat as neutral
        if data.method == "similarities":
            return matches / total
        else:  # opposites
            return mismatches / total

    # Greedy clustering
    unassigned = player_ids.copy()
    groups = []

    while len(unassigned) >= data.group_size:
        # Start group with first unassigned player
        group = [unassigned[0]]
        unassigned = unassigned[1:]

        while len(group) < data.group_size and unassigned:
            # Find best match for current group (avg score against group members)
            best_pid = None
            best_score = -1.0
            for candidate in unassigned:
                avg = sum(score(candidate, gm) for gm in group) / len(group)
                if avg > best_score:
                    best_score = avg
                    best_pid = candidate
            if best_pid:
                group.append(best_pid)
                unassigned.remove(best_pid)

        groups.append(group)

    # Distribute remainders into existing groups
    for pid in unassigned:
        # Find the group where this player fits best (avg score)
        best_group_idx = 0
        best_score = -1.0
        for i, group in enumerate(groups):
            avg = sum(score(pid, gm) for gm in group) / len(group)
            if avg > best_score:
                best_score = avg
                best_group_idx = i
        groups[best_group_idx].append(pid)

    return {"groups": groups}


def _split_into_groups(players: list, group_size: int) -> list:
    import math
    n = len(players)
    num_groups = math.ceil(n / group_size)
    groups = []
    idx = 0
    for i in range(num_groups):
        size = math.ceil((n - idx) / (num_groups - i))
        groups.append(players[idx:idx + size])
        idx += size
    return groups