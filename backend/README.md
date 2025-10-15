"""
# HSE NCHD Rostering System - Backend

## Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Database Setup
```bash
# For SQLite (development)
# Database will be created automatically

# For PostgreSQL (production)
export DATABASE_URL="postgresql://user:password@localhost/nchd_roster"
```

### 3. Run Migrations (if using Alembic)
```bash
alembic upgrade head
```

### 4. Start Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Posts
- GET /api/posts - List all posts
- POST /api/posts - Create post
- GET /api/posts/{id} - Get post
- PUT /api/posts/{id} - Update post
- DELETE /api/posts/{id} - Delete post

### Groups
- GET /api/groups - List all groups
- POST /api/groups - Create group
- GET /api/groups/{id} - Get group
- PUT /api/groups/{id} - Update group
- DELETE /api/groups/{id} - Delete group

### Roster (NEW!)
- GET /api/roster/shifts - List shifts (with filters)
- POST /api/roster/shifts - Create shift
- GET /api/roster/shifts/{id} - Get shift
- PUT /api/roster/shifts/{id} - Update shift
- DELETE /api/roster/shifts/{id} - Delete shift
- POST /api/roster/generate - Generate roster for month
- GET /api/roster/validate - Validate EWTD compliance
- GET /api/roster/validate/{user_id} - Validate for user
- POST /api/roster/import-csv - Import from CSV

## Testing API

### Create a shift
```bash
curl -X POST http://localhost:8000/api/roster/shifts \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "post_id": 1,
    "start": "2025-07-15T09:00:00",
    "end": "2025-07-15T17:00:00",
    "shift_type": "day_call"
  }'
```

### List shifts
```bash
curl http://localhost:8000/api/roster/shifts
```

### Generate roster
```bash
curl -X POST http://localhost:8000/api/roster/generate \
  -H "Content-Type: application/json" \
  -d '{
    "month": 8,
    "year": 2025,
    "post_ids": [1, 2, 3],
    "calls_per_night": 1
  }'
```

### Validate EWTD
```bash
curl http://localhost:8000/api/roster/validate
```

### Import CSV
```bash
curl -X POST http://localhost:8000/api/roster/import-csv \
  -H "Content-Type: application/json" \
  -d '{
    "csv_content": "Name,Post,Date,Type\nDr. Smith,DLHG 1,2025-07-15,day_call"
  }'
```

## File Structure

backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app (UPDATED)
│   ├── db.py                      # Database config
│   ├── models.py                  # SQLAlchemy models (UPDATED - added Shift, Leave)
│   ├── seed.py                    # Seed data (UPDATED)
│   ├── engine/
│   │   └── roster_engine.py       # Roster generation engine (existing)
│   ├── services/
│   │   ├── roster_import.py       # CSV import (existing)
│   │   └── roster_service.py      # Service layer (NEW)
│   ├── schemas/
│   │   └── roster.py              # Pydantic schemas (NEW)
│   └── routers/
│       ├── __init__.py            # Exports posts_router, groups_router
│       ├── api.py                 # /posts endpoints
│       ├── groups.py              # /groups endpoints
│       └── roster.py              # /roster endpoints (NEW)
├── requirements.txt               # Dependencies
└── README.md                      # This file

## Architecture

### Data Flow

1. **Frontend Request** → FastAPI Router (roster.py)
2. **Router** → Service Layer (roster_service.py)
3. **Service** ↔ Database (models.py via SQLAlchemy)
4. **Service** ↔ Roster Engine (roster_engine.py)
5. **Service** → Response to Frontend

### Key Components

- **Models** (models.py): Database schema
- **Schemas** (schemas/roster.py): API validation
- **Service** (services/roster_service.py): Business logic
- **Engine** (engine/roster_engine.py): Roster generation algorithms
- **Router** (routers/roster.py): HTTP endpoints

## Database Schema

### Shift
- id (PK)
- user_id (FK → users)
- post_id (FK → posts)
- start (DateTime)
- end (DateTime)
- shift_type (String: base, day_call, night_call, teaching, supervision)
- labels (JSON)
- created_at, updated_at

### Leave
- id (PK)
- user_id (FK → users)
- start (DateTime)
- end (DateTime)
- leave_type (String)
- status (String: pending, approved, rejected)

## EWTD Validation

The system validates:
- ✓ Max 24 hours continuous duty
- ✓ Minimum 11 hours daily rest
- ✓ Average 48 hours per week
- ✓ Minimum 24 hours weekly rest
- ✓ Max 7 night calls per month
- ✓ Max 3 consecutive nights

## Integration with Frontend

### Frontend API Service (src/services/api.js)
```javascript
export const rosterApi = {
  getShifts: (params) => apiCall('/roster/shifts', { params }),
  createShift: (data) => apiCall('/roster/shifts', { method: 'POST', body: data }),
  generateRoster: (data) => apiCall('/roster/generate', { method: 'POST', body: data }),
};
```

### Enable in Frontend
In frontend/src/App.jsx, uncomment:
```javascript
const [postsData, shiftsData] = await Promise.all([
  postsApi.getAll(),
  rosterApi.getShifts(), // ← Uncomment
]);
setShifts(shiftsData.shifts); // ← Uncomment
```

## Development Workflow

1. **Make model changes** in models.py
2. **Update schemas** in schemas/roster.py
3. **Update service** in services/roster_service.py
4. **Update router** in routers/roster.py
5. **Test endpoint** with curl or Postman
6. **Update frontend** API calls

## Production Checklist

- [ ] Switch to PostgreSQL
- [ ] Add authentication (JWT)
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Add logging
- [ ] Set up monitoring
- [ ] Configure backup
- [ ] Add caching (Redis)
- [ ] Enable CORS properly
- [ ] Add API versioning

## Troubleshooting

### Import Error: No module named 'app'
```bash
# Run from backend/ directory
cd backend
uvicorn app.main:app --reload
```

### Database locked (SQLite)
```bash
# Kill any running processes or switch to PostgreSQL
```

### CORS errors
```bash
# Verify frontend URL in main.py allow_origins list
```

### 404 on /api/roster/shifts
```bash
# Verify roster router is imported and mounted in main.py
```
"""
