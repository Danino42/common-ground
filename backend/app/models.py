from pydantic import BaseModel
from typing import Optional

class Card(BaseModel):
    id: str
    text: str

class CardSetCreate(BaseModel):
    name: str
    category: str
    cards: list[Card]
    is_public: bool = False

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class GameCreate(BaseModel):
    card_set_id: str
    max_players: int = 30

class PlayerJoin(BaseModel):
    lobby_code: str
    name: str

class CardAnswer(BaseModel):
    player_id: str
    lobby_code: str
    card_id: str
    answer: bool  # True = YES, False = NO

class PlayerAnswers(BaseModel):
    player_id: str
    lobby_code: str
    answers: dict  # {card_id: True/False/None}