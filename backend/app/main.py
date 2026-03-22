from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, card_sets, games

app = FastAPI(title="Common Ground API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://172.20.10.3:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/auth", tags=["auth"])
app.include_router(card_sets.router, prefix="/card-sets", tags=["card-sets"])
app.include_router(games.router, prefix="/games", tags=["games"])

@app.get("/")
def root():
    return {"status": "Common Ground API running"}