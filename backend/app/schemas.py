"""
schemas.py — Pydantic v2 models for request/response validation.

- AppointmentBase      : shared fields used by Create / Update / Out
- AppointmentCreate    : validates POST request body
- AppointmentUpdate    : validates PUT  request body (all fields optional)
- AppointmentOut       : serialises ORM objects → JSON responses

NOTE: The datetime types are aliased (dt_date, dt_time) because
Pydantic v2 field names cannot shadow their own type annotations.
"""

from datetime import date as dt_date, time as dt_time, datetime
from typing import Optional
from pydantic import BaseModel, Field


class AppointmentBase(BaseModel):
    """Fields common across create, update, and read operations."""

    name: str = Field(..., min_length=1, max_length=100, examples=["Rajesh Kumar"])
    age: int = Field(..., ge=0, le=150, examples=[35])
    gender: str = Field(..., min_length=1, max_length=10, examples=["Male"])
    phone: str = Field(..., min_length=5, max_length=20, examples=["9876543210"])
    department: str = Field(..., min_length=1, max_length=100, examples=["Cardiology"])
    doctor: str = Field(..., min_length=1, max_length=100, examples=["Dr. Sharma"])
    date: dt_date = Field(..., examples=["2026-07-20"])
    time: dt_time = Field(..., examples=["10:30"])
    slot: str = Field(..., min_length=1, max_length=50, examples=["Morning"])
    symptoms: Optional[str] = Field(None, max_length=2000, examples=["Chest pain since 2 days"])


class AppointmentCreate(AppointmentBase):
    """Used for POST /api/appointments/ — all fields required (except symptoms)."""
    pass


class AppointmentUpdate(BaseModel):
    """Used for PUT /api/appointments/{id} — every field is optional."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[str] = Field(None, min_length=1, max_length=10)
    phone: Optional[str] = Field(None, min_length=5, max_length=20)
    department: Optional[str] = Field(None, min_length=1, max_length=100)
    doctor: Optional[str] = Field(None, min_length=1, max_length=100)
    date: Optional[dt_date] = None
    time: Optional[dt_time] = None
    slot: Optional[str] = Field(None, min_length=1, max_length=50)
    symptoms: Optional[str] = Field(None, max_length=2000)


class AppointmentOut(AppointmentBase):
    """Used for API responses — includes server-managed fields."""

    id: int
    created_at: datetime

    # Enable ORM-mode so Pydantic reads data from SQLAlchemy objects
    model_config = {"from_attributes": True}
