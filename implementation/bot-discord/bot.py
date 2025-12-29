import os, re, json, pathlib
from io import BytesIO

import discord
from discord.ext import commands
from dotenv import load_dotenv
import aiohttp

load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")
GUILD_ID = os.getenv("GUILD_ID")

OPINION_API_URL = os.getenv("OPINION_API_URL")

TARGET_CHANNEL_IDS = set()

intents = discord.Intents.default()
intents.guilds = True
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

COURSE_RE = re.compile(r"\b([A-Z]{3}\d+)\b", re.IGNORECASE)

PROF_NAME_RE = re.compile(
    r"\b(?:prof(?:esseur)?|dr\.?|doctor|teacher|instructor)\s+"
    r"([A-Z][a-zÀ-ÖØ-öø-ÿ\-]+(?:\s+[A-Z][a-zÀ-ÖØ-öø-ÿ\-]+)?)",
    re.IGNORECASE,
)

OPINION_HINTS = {
    "fr": {"prof", "professeur", "cours", "matière", "classe", "bon", "mauvais", "difficile", "facile"},
    "en": {"professor", "teacher", "instructor", "course", "class", "good", "bad", "difficult", "easy"},
}

OPINION_KEYWORDS = set().union(*OPINION_HINTS.values())


def extract_course_codes(text: str):
    return sorted({m.group(1).upper() for m in COURSE_RE.finditer(text or "")})


def extract_professor_name(text: str):
    m = PROF_NAME_RE.search(text or "")
    return m.group(1) if m else None


def looks_like_opinion(text: str) -> bool:
    return bool(extract_course_codes(text))


def record_from_message(msg: discord.Message):
    text = msg.content or ""
    courses = extract_course_codes(text)
    prof = extract_professor_name(text)

    base = {
        "message_id": str(msg.id),
        "guild_id": str(msg.guild.id) if msg.guild else None,
        "channel_id": str(msg.channel.id),
        "channel_name": getattr(msg.channel, "name", None),
        "author_id": str(msg.author.id),
        "author_name": f"{msg.author.name}#{msg.author.discriminator}",
        "created_at": msg.created_at.isoformat(),
        "text": text,
    }

    if courses:
        return [{**base, "course_code": c, "professor_name": prof} for c in courses]
    else:
        return []


def group_by_course(flat_records):
    grouped = {}
    for r in flat_records:
        code = r.get("course_code")
        if not code:
            continue
        if code not in grouped:
            grouped[code] = []

        grouped[code].append({
            "professor_name": r.get("professor_name"),
            "text": r.get("text"),
            "message_id": r.get("message_id"),
            "author_id": r.get("author_id"),
            "author_name": r.get("author_name"),
            "created_at": r.get("created_at"),
            "channel_id": r.get("channel_id"),
            "channel_name": r.get("channel_name"),
        })
    return grouped


async def post_opinion_to_api(record: dict):
    if not OPINION_API_URL:
        return

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(OPINION_API_URL, json=record, timeout=5) as resp:
                if resp.status >= 400:
                    body = await resp.text()
                    print(f"[OPINION API] Error {resp.status}: {body}")
    except Exception as e:
        print("[OPINION API] Exception while posting opinion:", e)


@bot.event
async def on_message(message: discord.Message):
    await bot.process_commands(message)

    if message.author.bot or not message.guild:
        return
    if TARGET_CHANNEL_IDS and message.channel.id not in TARGET_CHANNEL_IDS:
        return

    text = (message.content or "").strip()
    if not text or not looks_like_opinion(text):
        return

    recs = record_from_message(message)
    if not recs:
        return

    pathlib.Path("exports").mkdir(exist_ok=True)
    with open("exports/opinions_stream.ndjson", "a", encoding="utf-8") as f:
        for r in recs:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    for r in recs:
        await post_opinion_to_api(r)


@bot.event
async def on_ready():
    print(f"Logged in as {bot.user} (ID: {bot.user.id})")


if __name__ == "__main__":
    if not TOKEN:
        raise SystemExit("Missing DISCORD_TOKEN in .env")
    bot.run(TOKEN)
