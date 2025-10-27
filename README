# HSE NCHD Rostering System V2

A comprehensive rostering and leave management system for Non-Consultant Hospital Doctors (NCHDs) in the Health Service Executive (HSE).

## Quick Start

### Prerequisites
- **Python 3.12** (3.14 not yet supported by SQLAlchemy)
- Node.js 18+
- npm

### Installation

**macOS:**
```bash
brew install python@3.12 node
```

**Ubuntu:**
```bash
sudo apt install python3.12 python3.12-venv nodejs npm
```

### Setup & Run

```bash
# Backend setup
./setup-backend.sh

# Frontend setup  
./setup-frontend.sh

# Start both servers
./start-dev.sh
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Manual Setup (if scripts don't work)

**Backend:**
```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -c "from app.db import Base, engine; Base.metadata.create_all(bind=engine)"
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Features

- ✅ Post management with EWTD validation
- ✅ Roster generation engine
- ✅ Drag & drop calendar interface
- ✅ CSV import/export
- ✅ WCAG 2.1 AA accessibility compliant
- ✅ Real-time shift validation
- ✅ Leave management

## Project Structure

```
NCHD_Roster_V2/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── engine/      # Roster generation engine
│   │   ├── models.py    # SQLAlchemy models
│   │   ├── routers/     # API endpoints
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/    # Business logic
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Atomic design components
│   │   ├── services/    # API client
│   │   └── utils/       # Utilities
│   └── package.json
└── docs/               # Documentation
```

## Documentation

- [Backend README](backend/README.md)
- [Frontend Setup Guide](frontend/HSE%20NCHD%20Rostering%20System%20-%20Frontend%20Setup%20Guide)
- [Quick Start Guide](QuickStart)

## Technology Stack

**Backend:**
- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- Python 3.12 (required)
- SQLite (development) / PostgreSQL (production)

**Frontend:**
- React 18.2
- Vite 5.0
- Lucide React (icons)
- Native CSS (no Tailwind)

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Integration tests (requires backend to be running)
./test-integration.sh
```

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

**backend/.env:**
```
DATABASE_URL=sqlite:///./nchd_roster.db
```

**frontend/.env:**
```
VITE_API_BASE=http://localhost:8000/api
```

## Troubleshooting

### Python Version Issues

If you see SQLAlchemy import errors, you're likely using Python 3.14:

```bash
# Check your Python version
python3 --version

# Install Python 3.12
brew install python@3.12  # macOS
sudo apt install python3.12  # Ubuntu

# Recreate venv with Python 3.12
cd backend
rm -rf venv
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Port Already in Use

```bash
# Kill processes on ports 8000 and 5173
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Database Issues

```bash
cd backend
source venv/bin/activate
rm nchd_roster.db  # Delete old database
python -c "from app.db import Base, engine; Base.metadata.create_all(bind=engine)"
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

Apache License 2.0 - See [LICENSE](LICENSE) for details.

Copyright © 2025 Health Service Executive

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
