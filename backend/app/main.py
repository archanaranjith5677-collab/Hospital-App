"""
main.py — FastAPI application entry point.

Start the server with:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Features:
  - CORS enabled for frontend (React dev server on localhost:5173)
  - Automatic table creation on startup via lifespan
  - REST router mounted at /api/appointments
  - Interactive Swagger docs at /docs
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers.appointments import router as appointments_router


# ---------------------------------------------------------------------------
# Lifespan — runs BEFORE the server starts accepting requests.
# Creates all tables defined in models.py if they don't already exist.
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle for the FastAPI app."""
    # Startup: ensure DB tables exist
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: nothing to clean up (connections are managed per-request)


# ---------------------------------------------------------------------------
# FastAPI app instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Hospital Appointment Booking API",
    description="REST API for booking, viewing, editing, and deleting hospital appointments.  Built with FastAPI + SQLAlchemy + PostgreSQL.",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS — allow the React dev server to call the API
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server (default)
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Mount the appointments router
# ---------------------------------------------------------------------------
app.include_router(appointments_router)


# ---------------------------------------------------------------------------
# Root health-check endpoint
# ---------------------------------------------------------------------------
@app.get("/", tags=["health"])
def root():
    """Simple health-check endpoint."""
    return {
        "message": "Hospital Appointment Booking API is running.",
        "docs": "/docs",
        "openapi": "/openapi.json",
    }
