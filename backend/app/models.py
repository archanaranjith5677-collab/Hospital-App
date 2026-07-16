"""
models.py — SQLAlchemy ORM model for the 'appointments' table.

Columns:
  id          — auto-increment primary key
  name        — patient name (required)
  age         — patient age (required)
  gender      — Male / Female / Other
  phone       — contact number
  department  — hospital department (e.g., Cardiology)
  doctor      — assigned doctor
  date        — appointment date
  time        — appointment time
  slot        — Morning / Afternoon / Evening
  symptoms    — optional text field
  created_at  — timestamp of record creation
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Date, Time, DateTime
from app.database import Base


class Appointment(Base):
    """Represents a single hospital appointment booking."""

    __tablename__ = "appointments"

    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Patient details
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)
    phone = Column(String(20), nullable=False)

    # Appointment details
    department = Column(String(100), nullable=False)
    doctor = Column(String(100), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    slot = Column(String(50), nullable=False)

    # Symptoms (optional free-text)
    symptoms = Column(Text, nullable=True)

    # Auto-set timestamp on creation
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Appointment id={self.id} name='{self.name}' dept='{self.department}'>"
