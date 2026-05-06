from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from app.database import db
from app.auth import create_token, decode_token, generate_otp
import datetime
import os

router = APIRouter()
security = HTTPBearer(auto_error=False)

# ── Email ─────────────────────────────────────────────────────────────────────

def send_otp_email(to_email: str, otp: str):
    import sendgrid
    from sendgrid.helpers.mail import Mail

    sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SMTP_PASS"))
    message = Mail(
        from_email=os.getenv("FROM_EMAIL"),
        to_emails=to_email,
        subject=f"{otp} is your Common Ground code",
        html_content=f"""
        <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:2rem;">
          <h2 style="color:#15803d;margin:0 0 0.5rem;">Common Ground</h2>
          <p style="color:#6b7280;margin:0 0 2rem;">Your login code</p>
          <div style="font-size:2.5rem;font-weight:900;letter-spacing:0.3em;color:#1c1917;background:#f0fdf4;border:2px solid #bbf7d0;border-radius:16px;padding:1.5rem;text-align:center;">
            {otp}
          </div>
          <p style="color:#9ca3af;font-size:0.85rem;margin:1.5rem 0 0;">
            Expires in 10 minutes. If you did not request this, ignore this email.
          </p>
        </div>
        """
    )
    response = sg.send(message)
    if response.status_code >= 400:
        raise Exception(f"SendGrid error {response.status_code}: {response.body}")

# ── Auth helper ───────────────────────────────────────────────────────────────

async def get_current_facilitator(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(credentials.credentials)
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        facilitator = await db["facilitators"].find_one({"email": email})
        if not facilitator:
            raise HTTPException(status_code=401, detail="User not found")
        return facilitator
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ── Models ────────────────────────────────────────────────────────────────────

class EmailRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class SavedSetsPayload(BaseModel):
    saved_card_sets: list[str]

# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/login/request")
async def request_otp(data: EmailRequest):
    otp = generate_otp()
    expires = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)

    # Upsert — creates account automatically on first login
    await db["facilitators"].update_one(
        {"email": data.email},
        {
            "$set": {
                "otp": otp,
                "otp_expires": expires.isoformat(),
            },
            "$setOnInsert": {
                "email": data.email,
                "saved_card_sets": [],
                "created_at": datetime.datetime.utcnow().isoformat(),
            }
        },
        upsert=True,
    )

    try:
        send_otp_email(data.email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

    return {"status": "sent"}


@router.post("/login/verify")
async def verify_otp(data: VerifyOTPRequest):
    facilitator = await db["facilitators"].find_one({"email": data.email})
    if not facilitator:
        raise HTTPException(status_code=404, detail="No OTP requested for this email")

    stored_otp = facilitator.get("otp")
    otp_expires = facilitator.get("otp_expires")

    if not stored_otp or not otp_expires:
        raise HTTPException(status_code=400, detail="No OTP requested")

    if datetime.datetime.utcnow() > datetime.datetime.fromisoformat(otp_expires):
        raise HTTPException(status_code=400, detail="Code expired")

    if data.otp != stored_otp:
        raise HTTPException(status_code=400, detail="Invalid code")

    await db["facilitators"].update_one(
        {"email": data.email},
        {"$unset": {"otp": "", "otp_expires": ""}}
    )

    token = create_token({"sub": data.email})
    return {"token": token, "email": data.email}


@router.get("/me")
async def get_me(facilitator=Depends(get_current_facilitator)):
    return {
        "email": facilitator["email"],
        "saved_card_sets": facilitator.get("saved_card_sets", []),
    }

@router.get("/me/saved-sets")
async def get_saved_sets(facilitator=Depends(get_current_facilitator)):
    return {"saved_card_sets": facilitator.get("saved_card_sets", [])}

@router.patch("/me/saved-sets")
async def update_saved_sets(data: SavedSetsPayload, facilitator=Depends(get_current_facilitator)):
    await db["facilitators"].update_one(
        {"email": facilitator["email"]},
        {"$set": {"saved_card_sets": data.saved_card_sets}}
    )
    return {"status": "ok"}