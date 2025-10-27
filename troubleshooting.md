# 🔧 Troubleshooting Guide: Python 3.14 / SQLAlchemy Issue

## Problem Summary
Your system is trying to use Python 3.14 with SQLAlchemy 2.0.23, which are incompatible.

**Error message:**
```
AssertionError: Class <class 'sqlalchemy.sql.elements.SQLCoreOperations'> directly 
inherits TypingOnly but has additional attributes
```

## Solutions (Pick ONE)

### ✅ Solution 1: Use Python 3.12 (RECOMMENDED)

You already have Python 3.12 installed. This is the easiest fix.

```bash
# 1. Clean up everything first
cd ~/Documents/GitHub/NCHD_Roster_V2
rm -rf backend/venv
lsof -ti:8000 | xargs kill -9  # Kill any hanging processes
lsof -ti:5173 | xargs kill -9

# 2. Replace requirements.txt
cp requirements-updated.txt backend/requirements.txt

# 3. Run the fixed setup script
chmod +x setup-backend-fixed.sh
./setup-backend-fixed.sh

# 4. Test backend manually first
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open another terminal and test:
```bash
curl http://localhost:8000/health
# Should return: {"ok":true,"version":"0.2.0"}
```

If backend works, proceed:
```bash
# Ctrl+C to stop backend, then:
cd ..
chmod +x start-dev-fixed.sh
./start-dev-fixed.sh
```

---

### 🔄 Solution 2: Keep Python 3.14, upgrade SQLAlchemy

If you want to use Python 3.14, update `backend/requirements.txt`:

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.28  # ← Newer version that supports Python 3.14
pydantic==2.6.1
python-dateutil==2.8.2
```

Then:
```bash
cd backend
rm -rf venv
python3.14 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python -c "from app.db import Base, engine; Base.metadata.create_all(bind=engine)"
```

---

## Step-by-Step Recovery (Solution 1)

### 1. Stop Everything
```bash
# Kill any hanging processes
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### 2. Clean Backend
```bash
cd ~/Documents/GitHub/NCHD_Roster_V2/backend
rm -rf venv
rm -f nchd_roster.db  # Start fresh
cd ..
```

### 3. Update Requirements
```bash
# Download the fixed scripts and requirements from the outputs
cp /path/to/requirements-updated.txt backend/requirements.txt
cp /path/to/setup-backend-fixed.sh .
cp /path/to/start-dev-fixed.sh .
```

### 4. Setup Backend
```bash
chmod +x setup-backend-fixed.sh
./setup-backend-fixed.sh
```

You should see:
```
✓ Python 3.12 found: Python 3.12.12
📦 Creating virtual environment with Python 3.12...
🔌 Activating virtual environment...
📦 Upgrading pip...
📦 Installing dependencies...
🗄️  Initializing database...
✅ Backend setup complete!
```

### 5. Test Backend Manually
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Will watch for changes in these directories: ['/Users/dgolden/...']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Test it:**
Open another terminal:
```bash
curl http://localhost:8000/health
# Should return: {"ok":true,"version":"0.2.0"}

curl http://localhost:8000/api/posts
# Should return: [{"id":1,"title":"DLHG 1",...}, ...]
```

### 6. Start Both Servers
If backend works, stop it (Ctrl+C) and run:
```bash
cd ..  # Back to project root
chmod +x start-dev-fixed.sh
./start-dev-fixed.sh
```

---

## Verification Checklist

After setup, verify each step:

- [ ] Backend starts without errors
- [ ] `curl http://localhost:8000/health` returns `{"ok":true}`
- [ ] `curl http://localhost:8000/api/posts` returns posts array
- [ ] Frontend opens at http://localhost:5173
- [ ] No console errors in browser (F12)
- [ ] Can see posts in the Posts tab

---

## Common Issues

### Issue: "uvicorn: command not found"
**Cause:** Virtual environment not activated

**Fix:**
```bash
cd backend
source venv/bin/activate
# Now uvicorn should be available
which uvicorn  # Should show: backend/venv/bin/uvicorn
```

### Issue: "ImportError: No module named 'app'"
**Cause:** Running uvicorn from wrong directory

**Fix:**
```bash
# Always run from backend/ directory:
cd backend
uvicorn app.main:app --reload
```

### Issue: "Address already in use"
**Cause:** Port 8000 or 5173 already taken

**Fix:**
```bash
# Kill processes on those ports
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Issue: Database errors
**Cause:** Corrupted or locked database

**Fix:**
```bash
cd backend
rm -f nchd_roster.db
rm -f nchd_roster.db-shm
rm -f nchd_roster.db-wal
# Restart server to recreate DB
```

### Issue: Frontend npm errors
**Cause:** Missing or outdated packages

**Fix:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm audit fix
```

---

## Testing After Fix

Run this test script:

```bash
#!/bin/bash
echo "🧪 Quick System Test"

# Test 1: Backend health
echo -n "1. Backend health... "
if curl -s http://localhost:8000/health | grep -q "ok"; then
    echo "✓ PASS"
else
    echo "✗ FAIL"
fi

# Test 2: Posts API
echo -n "2. Posts API... "
if curl -s http://localhost:8000/api/posts | grep -q "DLHG"; then
    echo "✓ PASS"
else
    echo "✗ FAIL"
fi

# Test 3: Shifts API
echo -n "3. Shifts API... "
if curl -s http://localhost:8000/api/roster/shifts | grep -q "shifts"; then
    echo "✓ PASS"
else
    echo "✗ FAIL"
fi

# Test 4: Frontend
echo -n "4. Frontend... "
if curl -s http://localhost:5173 | grep -q "NCHD"; then
    echo "✓ PASS"
else
    echo "✗ FAIL"
fi

echo ""
echo "If all tests pass, your system is working!"
```

---

## Still Having Issues?

### Get Detailed Logs

**Backend logs:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --log-level debug
```

**Frontend logs:**
```bash
cd frontend
npm run dev
# Then open browser console (F12) for errors
```

### Check Python/Package Versions
```bash
cd backend
source venv/bin/activate
python --version        # Should be 3.12.x
pip list | grep sqlalchemy  # Should be 2.0.25 or higher
pip list | grep fastapi     # Should be 0.109.0 or higher
```

### Nuclear Option (Start Completely Fresh)
```bash
cd ~/Documents/GitHub
rm -rf NCHD_Roster_V2
# Re-clone or re-create project
# Copy all files again
# Run setup-backend-fixed.sh
```

---

## Summary

**Key Points:**
1. **Use Python 3.12** (you have it installed)
2. **Update SQLAlchemy** to 2.0.25+ 
3. **Always activate venv** before running backend
4. **Run uvicorn from backend/ directory**
5. **Test backend alone first** before starting both servers

**Success indicators:**
- No import errors on startup
- Health endpoint returns JSON
- Posts API returns data
- Frontend loads without console errors

---

## Need Help?

If still stuck, provide:
1. Output of `python3.12 --version`
2. Output of `cd backend && source venv/bin/activate && pip list`
3. Full error message from uvicorn
4. Output of `ls -la backend/venv/bin/`
