"""
Run with: python -m app.seed
from the backend/ directory with venv activated
"""
import asyncio
from app.database import db
import base64
import json
import datetime

PREMADE_SETS = [
    {
        "name": "Political Views",
        "category": "Politics",
        "description": "Statements about political topics to spark discussion.",
        "cards": [
            {"id": "1-1", "text": "I support a universal basic income"},
            {"id": "1-2", "text": "Climate change should be the #1 political priority"},
            {"id": "1-3", "text": "Borders should be more open to immigration"},
            {"id": "1-4", "text": "Wealthy people should pay significantly more taxes"},
            {"id": "1-5", "text": "Social media does more harm than good to democracy"},
            {"id": "1-6", "text": "The state should provide free university education"},
            {"id": "1-7", "text": "Surveillance cameras in public spaces make us safer"},
            {"id": "1-8", "text": "Nuclear energy is necessary for a green future"},
            {"id": "1-9", "text": "Voting should be mandatory for all citizens"},
            {"id": "1-10", "text": "Corporations have too much political influence"},
        ],
    },
    {
        "name": "University Life",
        "category": "University",
        "description": "Relatable university experiences.",
        "cards": [
            {"id": "2-1", "text": "I have pulled an all-nighter before an exam"},
            {"id": "2-2", "text": "I have changed my major at least once"},
            {"id": "2-3", "text": "I have fallen asleep in a lecture"},
            {"id": "2-4", "text": "I joined a student club or society"},
            {"id": "2-5", "text": "I have studied abroad or want to"},
            {"id": "2-6", "text": "I prefer studying alone over group study"},
            {"id": "2-7", "text": "I have pulled an all-nighter before a deadline"},
            {"id": "2-8", "text": "I use AI tools to help with my studies"},
            {"id": "2-9", "text": "I have skipped a class to work on another assignment"},
            {"id": "2-10", "text": "I plan to do a masters degree"},
        ],
    },
    {
        "name": "Life & Values",
        "category": "Personal",
        "description": "Personal values and life perspectives.",
        "cards": [
            {"id": "3-1", "text": "I consider myself a spiritual person"},
            {"id": "3-2", "text": "Family is the most important thing in life"},
            {"id": "3-3", "text": "I believe hard work always pays off"},
            {"id": "3-4", "text": "Money can buy happiness to some extent"},
            {"id": "3-5", "text": "I think social media has made people lonelier"},
            {"id": "3-6", "text": "I prefer experiences over material possessions"},
            {"id": "3-7", "text": "I believe in second chances"},
            {"id": "3-8", "text": "I think people are fundamentally good"},
            {"id": "3-9", "text": "I value privacy over convenience"},
            {"id": "3-10", "text": "I think ambition is more important than talent"},
        ],
    },
    {
        "name": "Life in Switzerland",
        "category": "Switzerland",
        "description": "Experiences living in Switzerland.",
        "cards": [
            {"id": "4-1", "text": "I can speak Swiss German"},
            {"id": "4-2", "text": "I have been hiking in the Alps"},
            {"id": "4-3", "text": "I think Switzerland is too expensive"},
            {"id": "4-4", "text": "I use Swiss public transport daily"},
            {"id": "4-5", "text": "I have lived in more than one Swiss canton"},
            {"id": "4-6", "text": "I think Switzerland should join the EU"},
            {"id": "4-7", "text": "I prefer Swiss German over High German"},
            {"id": "4-8", "text": "I have voted in a Swiss referendum"},
            {"id": "4-9", "text": "I think Switzerland is too politically neutral"},
            {"id": "4-10", "text": "I feel more European than Swiss"},
        ],
    },
    {
        "name": "Work & Career",
        "category": "Work",
        "description": "Work experiences and career attitudes.",
        "cards": [
            {"id": "5-1", "text": "I have worked a job I truly hated"},
            {"id": "5-2", "text": "I prefer working remotely over the office"},
            {"id": "5-3", "text": "I think a 4-day work week should be standard"},
            {"id": "5-4", "text": "I have started or want to start my own business"},
            {"id": "5-5", "text": "I prioritise work-life balance over career growth"},
            {"id": "5-6", "text": "I have changed careers or plan to"},
            {"id": "5-7", "text": "I think passion matters more than salary"},
            {"id": "5-8", "text": "I have had a mentor who shaped my career"},
            {"id": "5-9", "text": "I check work messages outside working hours"},
            {"id": "5-10", "text": "I think AI will take my job within 10 years"},
        ],
    },
    {
        "name": "Food & Lifestyle",
        "category": "Lifestyle",
        "description": "Food habits and lifestyle choices.",
        "cards": [
            {"id": "6-1", "text": "I follow a vegetarian or vegan diet"},
            {"id": "6-2", "text": "I cook at home most days"},
            {"id": "6-3", "text": "I think fast food gets too much criticism"},
            {"id": "6-4", "text": "I have tried intermittent fasting"},
            {"id": "6-5", "text": "I care about where my food comes from"},
            {"id": "6-6", "text": "I would rather cook than go to a restaurant"},
            {"id": "6-7", "text": "I have tried a diet that did not work"},
            {"id": "6-8", "text": "I think food is one of life's great pleasures"},
            {"id": "6-9", "text": "I eat breakfast every day"},
            {"id": "6-10", "text": "I have gone through a phase of eating very healthy"},
        ],
    },

    {
    "name": "Common Ground Original",
    "category": "Icebreaker",
    "description": "The original Common Ground card deck: 45 statements spanning background, hobbies, lifestyle, university life and a few Zurich-specific ones.",
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
    "author": "system",
    "author_email": None,
    "is_public": False,
}
]


def generate_deck_hash(name: str, cards: list) -> str:
    payload = {"n": name, "c": [c["text"] for c in cards]}
    compact = json.dumps(payload, separators=(',', ':'), ensure_ascii=False)
    return base64.b64encode(compact.encode('utf-8')).decode('ascii')


async def seed():
    existing = await db["card_sets"].count_documents({"author": "system"})
    if existing > 0:
        print(f"Already seeded ({existing} system sets found). Skipping.")
        return

    docs = []
    for s in PREMADE_SETS:
        docs.append({
            "name": s["name"],
            "category": s["category"],
            "description": s["description"],
            "cards": s["cards"],
            "is_public": True,
            "author": "system",
            "author_email": None,
            "deck_hash": generate_deck_hash(s["name"], s["cards"]),
            "created_at": datetime.datetime.utcnow().isoformat(),
        })

    result = await db["card_sets"].insert_many(docs)
    print(f"Seeded {len(result.inserted_ids)} premade card sets.")


if __name__ == "__main__":
    asyncio.run(seed())