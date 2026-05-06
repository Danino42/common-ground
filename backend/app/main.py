from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, card_sets, games
import os
from dotenv import load_dotenv
from app.routers import facilitators

load_dotenv()

app = FastAPI(title="Common Ground API")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/auth", tags=["auth"])
app.include_router(card_sets.router, prefix="/card-sets", tags=["card-sets"])
app.include_router(games.router, prefix="/games", tags=["games"])
app.include_router(facilitators.router, prefix="/facilitators")

@app.get("/")
def root():
    return {"status": "Common Ground API running"}