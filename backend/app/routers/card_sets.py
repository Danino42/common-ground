from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
from app.database import db
from app.auth import decode_token
from bson import ObjectId
import datetime
import base64
import json
import hashlib

router = APIRouter()
security = HTTPBearer(auto_error=False)

# ── Auth helper ───────────────────────────────────────────────────────────────

async def get_facilitator_email(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Optional[str]:
    if not credentials:
        return None
    try:
        payload = decode_token(credentials.credentials)
        return payload.get("sub")
    except Exception:
        return None

# ── Hash generation ───────────────────────────────────────────────────────────

def generate_deck_hash(name: str, cards: list) -> str:
    """Generate a short shareable hash from deck content."""
    payload = {"n": name, "c": [c["text"] for c in cards]}
    compact = json.dumps(payload, separators=(',', ':'), ensure_ascii=False)
    encoded = base64.b64encode(compact.encode('utf-8')).decode('ascii')
    return encoded

def decode_deck_hash(hash_str: str) -> dict:
    """Decode a deck hash back to name + cards."""
    try:
        decoded = base64.b64decode(hash_str.encode('ascii')).decode('utf-8')
        return json.loads(decoded)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid deck hash")

# ── Models ────────────────────────────────────────────────────────────────────

class CardModel(BaseModel):
    id: str
    text: str

class CardSetCreate(BaseModel):
    name: str
    category: str = "Custom"
    description: str = ""
    cards: List[CardModel]
    is_public: bool = False

class CardSetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    cards: Optional[List[CardModel]] = None
    is_public: Optional[bool] = None

# ── Serializer ────────────────────────────────────────────────────────────────

def serialize(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/")
async def list_card_sets(
    email: Optional[str] = Depends(get_facilitator_email)
):
    """Return all sets visible to this user:
    - All public/system sets
    - Their own sets if authenticated
    Each includes saved status based on facilitator's saved list.
    """
    query = {"$or": [{"author": "system"}, {"is_public": True}]}
    if email:
        query = {"$or": [{"author": "system"}, {"is_public": True}, {"author_email": email}]}

    saved_ids = set()
    if email:
        facilitator = await db["facilitators"].find_one({"email": email})
        if facilitator:
            saved_ids = set(facilitator.get("saved_card_sets", []))

    sets = []
    async for doc in db["card_sets"].find(query):
        s = serialize(doc)
        s["saved"] = s["id"] in saved_ids
        sets.append(s)

    return sets


@router.get("/hash/:hash_str")
async def get_by_hash(hash_str: str):
    """Look up a card set by its deck hash."""
    doc = await db["card_sets"].find_one({"deck_hash": hash_str})
    if not doc:
        # Try decoding the hash directly
        data = decode_deck_hash(hash_str)
        return {
            "name": data["n"],
            "cards": [{"id": f"h-{i}", "text": t} for i, t in enumerate(data["c"])],
            "from_hash": True,
        }
    return serialize(doc)


@router.get("/{set_id}")
async def get_card_set(set_id: str):
    try:
        doc = await db["card_sets"].find_one({"_id": ObjectId(set_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    if not doc:
        raise HTTPException(status_code=404, detail="Card set not found")
    return serialize(doc)


@router.post("/")
async def create_card_set(
    data: CardSetCreate,
    email: Optional[str] = Depends(get_facilitator_email)
):
    cards_list = [c.dict() for c in data.cards]
    deck_hash = generate_deck_hash(data.name, cards_list)

    doc = {
        "name": data.name,
        "category": data.category,
        "description": data.description,
        "cards": cards_list,
        "is_public": data.is_public,
        "author": "system" if not email else "user",
        "author_email": email,
        "deck_hash": deck_hash,
        "created_at": datetime.datetime.utcnow().isoformat(),
    }
    result = await db["card_sets"].insert_one(doc)
    doc["id"] = str(result.inserted_id)
    del doc["_id"]

    # Auto-save to facilitator's saved list if authenticated
    if email:
        await db["facilitators"].update_one(
            {"email": email},
            {"$addToSet": {"saved_card_sets": doc["id"]}},
            upsert=True,
        )

    return doc


@router.patch("/{set_id}")
async def update_card_set(
    set_id: str,
    data: CardSetUpdate,
    email: Optional[str] = Depends(get_facilitator_email)
):
    try:
        doc = await db["card_sets"].find_one({"_id": ObjectId(set_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    if not doc:
        raise HTTPException(status_code=404, detail="Card set not found")
    if doc.get("author_email") != email:
        raise HTTPException(status_code=403, detail="Not your card set")

    update = {k: v for k, v in data.dict().items() if v is not None}

    # Regenerate hash if name or cards changed
    new_cards = update.get("cards", doc["cards"])
    new_name = update.get("name", doc["name"])
    if isinstance(new_cards[0], dict) is False:
        new_cards = [c.dict() for c in new_cards]
    update["deck_hash"] = generate_deck_hash(new_name, new_cards)

    await db["card_sets"].update_one({"_id": ObjectId(set_id)}, {"$set": update})
    updated = await db["card_sets"].find_one({"_id": ObjectId(set_id)})
    return serialize(updated)


@router.delete("/{set_id}")
async def delete_card_set(
    set_id: str,
    email: Optional[str] = Depends(get_facilitator_email)
):
    try:
        doc = await db["card_sets"].find_one({"_id": ObjectId(set_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    if not doc:
        raise HTTPException(status_code=404, detail="Card set not found")
    if doc.get("author_email") != email:
        raise HTTPException(status_code=403, detail="Not your card set")

    await db["card_sets"].delete_one({"_id": ObjectId(set_id)})
    # Remove from all facilitators' saved lists
    await db["facilitators"].update_many(
        {}, {"$pull": {"saved_card_sets": set_id}}
    )
    return {"status": "deleted"}


@router.post("/{set_id}/save")
async def save_card_set(
    set_id: str,
    email: Optional[str] = Depends(get_facilitator_email)
):
    if not email:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db["facilitators"].update_one(
        {"email": email},
        {"$addToSet": {"saved_card_sets": set_id}},
        upsert=True,
    )
    return {"status": "saved"}


@router.delete("/{set_id}/save")
async def unsave_card_set(
    set_id: str,
    email: Optional[str] = Depends(get_facilitator_email)
):
    if not email:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db["facilitators"].update_one(
        {"email": email},
        {"$pull": {"saved_card_sets": set_id}},
    )
    return {"status": "unsaved"}