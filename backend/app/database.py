"""
database.py — SQLAlchemy engine, session factory, and declarative Base.

Uses the DATABASE_URL from .env (loaded via python-dotenv).
On startup, tables are created automatically via Base.metadata.create_all.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from backend/.env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/hospital_booking")

# Create the SQLAlchemy engine (echo=False for clean logs, set True to debug SQL)
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

# SessionLocal is a factory for new database sessions (used as a dependency in FastAPI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a database session and ensures
    it is closed after the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
