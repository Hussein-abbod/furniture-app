"""
Contact form endpoint — sends email via Gmail SMTP.
"""

import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1, max_length=5000)


def _build_html(data: ContactRequest) -> str:
    """Build a nice HTML email from the contact form data."""
    return f"""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0C3B2E, #1a5c45); padding: 32px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">📬 New Contact Form Submission</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">
                You have a new message from the ONYX website.
            </p>
        </div>

        <div style="background: #ffffff; padding: 32px; border: 1px solid #e8e8e8; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; width: 120px; vertical-align: top;">
                        <strong>From</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 14px;">
                        {data.name}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; vertical-align: top;">
                        <strong>Email</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 14px;">
                        <a href="mailto:{data.email}" style="color: #0C3B2E;">{data.email}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; vertical-align: top;">
                        <strong>Subject</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 14px;">
                        {data.subject}
                    </td>
                </tr>
            </table>

            <div style="margin-top: 24px;">
                <p style="color: #888; font-size: 13px; margin: 0 0 8px;"><strong>Message</strong></p>
                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; color: #333; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">
{data.message}
                </div>
            </div>
        </div>

        <div style="background: #f5f5f5; padding: 20px 32px; border-radius: 0 0 16px 16px; border: 1px solid #e8e8e8; border-top: none;">
            <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                This email was sent from the ONYX Furniture contact form.
            </p>
        </div>
    </div>
    """


@router.post("")
async def send_contact_email(data: ContactRequest):
    """
    Receive a contact-form submission and forward it via Gmail SMTP.
    """
    # Validate that SMTP is configured
    if not settings.SMTP_EMAIL or not settings.SMTP_APP_PASSWORD:
        logger.error("SMTP credentials not configured in .env")
        raise HTTPException(
            status_code=500,
            detail="Email service is not configured. Please contact support.",
        )

    # Build the email
    msg = MIMEMultipart("alternative")
    msg["From"] = f"ONYX Contact Form <{settings.SMTP_EMAIL}>"
    msg["To"] = settings.SMTP_EMAIL  # Send to yourself
    msg["Reply-To"] = data.email     # So you can reply directly to the sender
    msg["Subject"] = f"[ONYX Contact] {data.subject}"

    # Plain-text fallback
    plain = (
        f"New contact from: {data.name} ({data.email})\n"
        f"Subject: {data.subject}\n\n"
        f"Message:\n{data.message}"
    )
    msg.attach(MIMEText(plain, "plain"))
    msg.attach(MIMEText(_build_html(data), "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.SMTP_EMAIL, settings.SMTP_APP_PASSWORD)
            server.send_message(msg)

        logger.info("Contact email sent from %s (%s)", data.name, data.email)
        return {"message": "Your message has been sent successfully!"}

    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP authentication failed — check App Password")
        raise HTTPException(
            status_code=500,
            detail="Email authentication failed. Please try again later.",
        )
    except Exception as e:
        logger.error("Failed to send contact email: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to send message. Please try again later.",
        )
