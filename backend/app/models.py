from pydantic import BaseModel, EmailStr
from typing import Optional

# Auth
class FacilitatorRegister(BaseModel):
    name: str
    email: str
    password: str

class FacilitatorLogin(BaseModel):
    email: str
    password: str

# Card Sets
class Card(BaseModel):
    id: str
    text: str

class CardSetCreate(BaseModel):
    name: str
    category: str
    cards: list[Card]
    is_public: bool = False

# Games
class GameCreate(BaseModel):
    card_set_id: str
    max_players: int = 30

class PlayerJoin(BaseModel):
    lobby_code: str
    name: str