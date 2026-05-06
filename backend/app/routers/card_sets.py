from fastapi import APIRouter, HTTPException
from app.database import db
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId
import datetime

router = APIRouter()

# ── Models ──────────────────────────────────────────────────────────────────

class CardModel(BaseModel):
    id: str
    text: str

class CardSetCreate(BaseModel):
    name: str
    category: str
    cards: List[CardModel]
    is_public: bool = False

class CardSetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    cards: Optional[List[CardModel]] = None
    is_public: Optional[bool] = None

# ── Helpers ──────────────────────────────────────────────────────────────────

def serialize(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

# ── Routes ───────────────────────────────────────────────────────────────────

@router.get("/")
async def list_card_sets(facilitator_email: str):
    """Return all card sets visible to this facilitator:
       - System/premade (author == 'system')
       - Their own sets
       - Community public sets
    Each includes a `saved` boolean based on the facilitator's saved list.
    """
    # Fetch facilitator's saved set ids
    facilitator = await db["facilitators"].find_one({"email": facilitator_email})
    saved_ids = set(facilitator.get("saved_card_sets", [])) if facilitator else set()

    cursor = db["card_sets"].find({
        "$or": [
            {"author": "system"},
            {"author_email": facilitator_email},
            {"is_public": True},
        ]
    })
    sets = []
    async for doc in cursor:
        s = serialize(doc)
        s["saved"] = s["id"] in saved_ids
        sets.append(s)
    return sets


@router.get("/{set_id}")
async def get_card_set(set_id: str):
    doc = await db["card_sets"].find_one({"_id": ObjectId(set_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Card set not found")
    return serialize(doc)


@router.post("/")
async def create_card_set(data: CardSetCreate, facilitator_email: str):
    doc = {
        "name": data.name,
        "category": data.category,
        "cards": [c.dict() for c in data.cards],
        "is_public": data.is_public,
        "author": "user",
        "author_email": facilitator_email,
        "created_at": datetime.datetime.utcnow().isoformat(),
    }
    result = await db["card_sets"].insert_one(doc)
    doc["id"] = str(result.inserted_id)
    del doc["_id"]
    return doc


@router.patch("/{set_id}")
async def update_card_set(set_id: str, data: CardSetUpdate, facilitator_email: str):
    doc = await db["card_sets"].find_one({"_id": ObjectId(set_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Card set not found")
    if doc.get("author_email") != facilitator_email:
        raise HTTPException(status_code=403, detail="Not your card set")
    update = {k: v for k, v in data.dict().items() if v is not None}
    await db["card_sets"].update_one({"_id": ObjectId(set_id)}, {"$set": update})
    return {"status": "updated"}


@router.post("/{set_id}/save")
async def save_card_set(set_id: str, facilitator_email: str):
    await db["facilitators"].update_one(
        {"email": facilitator_email},
        {"$addToSet": {"saved_card_sets": set_id}},
        upsert=True,
    )
    return {"status": "saved"}


@router.delete("/{set_id}/save")
async def unsave_card_set(set_id: str, facilitator_email: str):
    await db["facilitators"].update_one(
        {"email": facilitator_email},
        {"$pull": {"saved_card_sets": set_id}},
    )
    return {"status": "unsaved"}