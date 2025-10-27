# HSE NCHD Rostering System - Quick Start

## 1. Setup Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -c "from app.db import Base, engine; Base.metadata.create_all(bind=engine)"
```

## 2. Start Backend (Terminal 1)
```bash
cd backend
source venv/bin/activate

# Development mode (auto-reload on code changes)
uvicorn app.main:app --reload --reload-dir ./app --host 0.0.0.0 --port 8000

# OR Production mode (no auto-reload)
# uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 3. Setup Frontend (Terminal 2)
```bash
cd frontend
npm install
```

## 4. Start Frontend
```bash
cd frontend
npm run dev
```

## 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Using the Startup Script

Alternatively, use the automated script:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

Press Ctrl+C to stop all servers.

## Verification

Test that the backend is working:
```bash
curl http://localhost:8000/health
# Should return: {"ok": true, "version": "0.2.0"}

curl http://localhost:8000/api/posts
# Should return list of posts
```

## Notes

- The `--reload-dir ./app` flag ensures uvicorn only watches the app directory
- This prevents infinite reload loops from watching the venv directory
- For production deployment, always use the non-reload mode
