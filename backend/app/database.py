from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "commonground")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

facilitators = db["facilitators"]
card_sets = db["card_sets"]
games = db["games"]