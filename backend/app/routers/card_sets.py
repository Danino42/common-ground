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
from openai import AsyncOpenAI
import os

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
    # Ensure author_display is always present
    if not doc.get("author_display"):
        email = doc.get("author_email", "")
        if doc.get("author") == "guest":
            doc["author_display"] = "guest"
        elif email:
            doc["author_display"] = email[:5]
        else:
            doc["author_display"] = "user"
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
    email: Optional[str] = Depends(get_facilitator_email),
    auto_save: bool = True,
):
    # Fetch username if logged in
    display_name = None
    if email:
        facilitator = await db["facilitators"].find_one({"email": email})
        if facilitator:
            display_name = facilitator.get("username") or email[:5]

    cards_list = [c.dict() for c in data.cards]
    deck_hash = generate_deck_hash(data.name, cards_list)

    doc = {
        "name": data.name,
        "category": data.category,
        "description": data.description,
        "cards": cards_list,
        "is_public": data.is_public,
        "author": "user" if email else "guest",
        "author_email": email,
        "author_display": display_name or "guest",  # ← add this
        "deck_hash": deck_hash,
        "created_at": datetime.datetime.utcnow().isoformat(),
    }
    result = await db["card_sets"].insert_one(doc)
    doc["id"] = str(result.inserted_id)
    del doc["_id"]

    if email and auto_save:
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

    # Allow edit if: same email, or both are None (guest set), or author is guest
    doc_email = doc.get("author_email")
    if doc_email != email and not (doc_email is None and email is None) and doc.get("author") != "guest":
        raise HTTPException(status_code=403, detail="Not your card set")

    update = {}
    if data.name is not None:
        update["name"] = data.name
    if data.cards is not None:
        cards_list = [c.dict() if hasattr(c, 'dict') else c for c in data.cards]
        update["cards"] = cards_list
        update["deck_hash"] = generate_deck_hash(
            data.name or doc["name"], cards_list
        )
    if data.category is not None:
        update["category"] = data.category
    if data.description is not None:
        update["description"] = data.description
    if data.is_public is not None:
        update["is_public"] = data.is_public

    if update:
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

class GenerateRequest(BaseModel):
    prompt: str
    count: int = 5
    existing_cards: list[str] = []

@router.post("/generate")
async def generate_cards(data: GenerateRequest):
    if not data.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")

    count = max(1, min(data.count, 20))  # clamp between 1 and 20

    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    system_prompt = """You are helping a facilitator create card sets for group sessions.
Each card is a short statement or question that participants respond to with Yes or No.
Return ONLY a JSON array of strings, nothing else. Example: ["I have lived in more than one country", "Bubble sort has O(n²) worst-case complexity"]

Follow these rules:
- Match the tone and style of the user's request exactly.
- If the request is about a technical or academic topic, generate factual true/false style statements suitable for knowledge testing or quizzes.
- If the request is about personal experiences, lifestyle or social topics, generate first-person icebreaker statements.
- If the request is vague, generate statements that fit naturally as icebreakers: personal experiences, habits, values, opinions.
- Keep each statement under 20 words.
- Vary the statements — avoid repetition in style or topic within the same batch.
- Never add explanations, prefixes like "Statement:" or numbering — just the raw statements."""

    existing_context = ""
    if data.existing_cards:
        sample = data.existing_cards[:5]
        existing_context = f"\n\nExisting cards in this deck for style reference:\n" + "\n".join(f"- {c}" for c in sample)

    user_prompt = f"Generate exactly {count} Yes/No statements for the following request: {data.prompt.strip()}{existing_context}"

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.8,
            max_tokens=1000,
        )

        content = response.choices[0].message.content.strip()

        # Strip markdown code fences if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()

        import json
        cards = json.loads(content)

        if not isinstance(cards, list):
            raise ValueError("Response is not a list")

        # Ensure all items are strings and trim to count
        cards = [str(c).strip() for c in cards if str(c).strip()][:count]

        return {"cards": cards}

    except Exception as e:
        print("OpenAI error:", repr(e))
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")