# Hospital Appointment Booking System

A full-stack web application for booking hospital appointments.

## Tech Stack

### Backend
- **FastAPI** — Python web framework
- **SQLAlchemy** — ORM for PostgreSQL
- **Uvicorn** — ASGI server
- **Pydantic** — Data validation

### Frontend
- **React 18** — UI library
- **Vite** — Build tool & dev server
- **Axios** — HTTP client

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cp .env.example .env        # Configure your DATABASE_URL
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on **http://localhost:5173** and proxies `/api` requests to the backend at **http://localhost:8000**.

### API Documentation
Once the backend is running, visit **http://localhost:8000/docs** for interactive Swagger docs.

## Project Structure
```
hospital-booking/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py          # Database engine & session
│   │   ├── main.py              # FastAPI app & CORS
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   └── routers/
│   │       ├── __init__.py
│   │       └── appointments.py  # CRUD endpoints
│   ├── .env                     # Database connection string
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.js           # Axios API client
    │   ├── components/
    │   │   ├── BookingForm.jsx
    │   │   ├── BookingForm.css
    │   │   ├── AppointmentsTable.jsx
    │   │   ├── AppointmentsTable.css
    │   │   ├── EditModal.jsx
    │   │   └── EditModal.css
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```
