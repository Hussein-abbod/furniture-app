"""
Site settings endpoints.
- GET  /api/settings         — public, returns all settings
- PUT  /api/settings         — admin-only, bulk-update settings
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict

from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.site_settings import SiteSettings

router = APIRouter(prefix="/api/settings", tags=["settings"])

# Default values seeded on first request
DEFAULTS = {
    "contact_phone": "+60 1111769177",
    "contact_email": "husseinobood88@gmail.com",
    "contact_address": "Puncak Muzaffar Hang Tuah Jaya, Jalan MH Utama, Taman Muzaffar Heights, 75450 Ayer Keroh, Malacca",
    "working_hours": "Mon – Fri: 9 AM – 6 PM\nSat: 10 AM – 4 PM",
}


def _seed_defaults(db: Session):
    """Insert default keys if they don't exist yet."""
    existing = {s.key for s in db.query(SiteSettings.key).all()}
    for key, value in DEFAULTS.items():
        if key not in existing:
            db.add(SiteSettings(key=key, value=value))
    db.commit()


class SettingsUpdate(BaseModel):
    settings: Dict[str, str]


@router.get("")
async def get_settings(db: Session = Depends(get_db)):
    """Public — anyone can read site settings."""
    _seed_defaults(db)
    rows = db.query(SiteSettings).all()
    return {row.key: row.value for row in rows}


@router.put("")
async def update_settings(
    body: SettingsUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """Admin-only — update one or more settings."""
    _seed_defaults(db)

    for key, value in body.settings.items():
        row = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if row:
            row.value = value
        else:
            db.add(SiteSettings(key=key, value=value))

    db.commit()
    rows = db.query(SiteSettings).all()
    return {row.key: row.value for row in rows}
