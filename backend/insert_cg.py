import asyncio
from app.database import db

async def insert():
    existing = await db["card_sets"].find_one({"name": "Common Ground Original"})
    if existing:
        print("Already exists")
        return
    deck = {
        "name": "Common Ground Original",
        "category": "Icebreaker",
        "description": "The original Common Ground card deck: 45 statements spanning background, hobbies, lifestyle, university life and a few Zurich-specific ones.",
        "author": "system",
        "author_email": None,
        "author_display": "system",
        "is_public": False,
        "deck_hash": "",
        "cards": [
            {"id": "cg1", "text": "I don't have family living here, so it can get lonely"},
            {"id": "cg2", "text": "Achieving good grades is a must in my family"},
            {"id": "cg3", "text": "I have lived in a different country"},
            {"id": "cg4", "text": "I have more than two siblings"},
            {"id": "cg5", "text": "My parents do not share the same educational background as I do"},
            {"id": "cg6", "text": "I have a multicultural background"},
            {"id": "cg7", "text": "I am a first-generation PhD/master's/bachelor's graduate"},
            {"id": "cg8", "text": "I am a dog person"},
            {"id": "cg9", "text": "I have a child"},
            {"id": "cg10", "text": "I enjoy gardening"},
            {"id": "cg11", "text": "I have visited the Zurich Kunsthaus"},
            {"id": "cg12", "text": "I love watching sitcoms"},
            {"id": "cg13", "text": "I can make sushi"},
            {"id": "cg14", "text": "I play video games"},
            {"id": "cg15", "text": "I like skiing, and Switzerland is great for that"},
            {"id": "cg16", "text": "I practice yoga regularly"},
            {"id": "cg17", "text": "I enjoy reading mystery novels"},
            {"id": "cg18", "text": "I am passionate about photography"},
            {"id": "cg19", "text": "I do not play any music instrument"},
            {"id": "cg20", "text": "I am not a morning person"},
            {"id": "cg21", "text": "I am not very spontaneous"},
            {"id": "cg22", "text": "I am not good at math without a calculator"},
            {"id": "cg23", "text": "I am not a fan of beer"},
            {"id": "cg24", "text": "Paris is overrated"},
            {"id": "cg25", "text": "I am not on any social media"},
            {"id": "cg26", "text": "I am not into techno music"},
            {"id": "cg27", "text": "I am not good at navigating without Google Maps"},
            {"id": "cg28", "text": "I journal regularly"},
            {"id": "cg29", "text": "I want to improve my work-life balance"},
            {"id": "cg30", "text": "I find it challenging to learn German"},
            {"id": "cg31", "text": "I am or used to be a volunteer"},
            {"id": "cg32", "text": "I enjoy cleaning and organizing"},
            {"id": "cg33", "text": "I am more of a night owl than a morning person"},
            {"id": "cg34", "text": "Tea is my essential morning boost"},
            {"id": "cg35", "text": "I thrive on multitasking. I can handle it!"},
            {"id": "cg36", "text": "I am good at planning vacations"},
            {"id": "cg37", "text": "I am uncertain about my career plan"},
            {"id": "cg38", "text": "I chose this major randomly, but now I like it"},
            {"id": "cg39", "text": "I prefer an academic career over working in the industry"},
            {"id": "cg40", "text": "I study and work simultaneously"},
            {"id": "cg41", "text": "I have failed an exam once"},
            {"id": "cg42", "text": "I have teaching experience at a university"},
            {"id": "cg43", "text": "I have done an exchange semester"},
            {"id": "cg44", "text": "I completed an internship"},
            {"id": "cg45", "text": "I enjoy reading books outside my interests"},
        ],
    }
    await db["card_sets"].insert_one(deck)
    print("Inserted Common Ground Original")

asyncio.run(insert())