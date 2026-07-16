"""
appointments.py — REST router for the /api/appointments resource.

Endpoints:
  POST   /api/appointments/       — create a new appointment
  GET    /api/appointments/       — list all appointments
  GET    /api/appointments/{id}   — get a single appointment
  PUT    /api/appointments/{id}   — update an existing appointment
  DELETE /api/appointments/{id}   — delete an appointment
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Appointment
from app.schemas import AppointmentCreate, AppointmentUpdate, AppointmentOut

# Create the router with a prefix and tag for OpenAPI docs grouping
router = APIRouter(prefix="/api/appointments", tags=["appointments"])


# ---------------------------------------------------------------------------
# POST — Create a new appointment booking
# ---------------------------------------------------------------------------
@router.post(
    "/",
    response_model=AppointmentOut,
    status_code=status.HTTP_201_CREATED,
    summary="Book a new appointment",
)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    """
    Accepts patient & appointment details, persists to the database,
    and returns the created appointment with its server-assigned id + created_at.
    """
    # Build ORM instance from Pydantic model (exclude_unset not needed here)
    new_appt = Appointment(**payload.model_dump())

    db.add(new_appt)
    db.commit()
    db.refresh(new_appt)  # populate id & created_at from the DB

    return new_appt


# ---------------------------------------------------------------------------
# GET — List all appointments (newest first)
# ---------------------------------------------------------------------------
@router.get(
    "/",
    response_model=List[AppointmentOut],
    summary="List all appointments",
)
def list_appointments(db: Session = Depends(get_db)):
    """Returns every appointment record, ordered by creation time descending."""
    return db.query(Appointment).order_by(Appointment.created_at.desc()).all()


# ---------------------------------------------------------------------------
# GET — Retrieve a single appointment by its ID
# ---------------------------------------------------------------------------
@router.get(
    "/{appointment_id}",
    response_model=AppointmentOut,
    summary="Get one appointment",
)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """Fetch a specific appointment by its primary key.  404 if not found."""
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with id={appointment_id} not found.",
        )
    return appt


# ---------------------------------------------------------------------------
# PUT — Update an existing appointment (partial update)
# ---------------------------------------------------------------------------
@router.put(
    "/{appointment_id}",
    response_model=AppointmentOut,
    summary="Update an appointment",
)
def update_appointment(
    appointment_id: int,
    payload: AppointmentUpdate,
    db: Session = Depends(get_db),
):
    """
    Partially updates an appointment.  Only the fields present in the
    request body are changed; all others retain their current values.
    """
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with id={appointment_id} not found.",
        )

    # Apply only the fields that were explicitly sent (exclude_unset=True)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appt, field, value)

    db.commit()
    db.refresh(appt)

    return appt


# ---------------------------------------------------------------------------
# DELETE — Remove an appointment
# ---------------------------------------------------------------------------
@router.delete(
    "/{appointment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an appointment",
)
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """Deletes the appointment with the given ID.  404 if it doesn't exist."""
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with id={appointment_id} not found.",
        )

    db.delete(appt)
    db.commit()

    # 204 No Content — return nothing
    return None
