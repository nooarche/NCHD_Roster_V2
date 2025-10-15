#!/bin/bash

echo "🔍 Checking HSE NCHD Rostering System Setup"
echo "============================================"

ISSUES=0

# Check backend files
echo ""
echo "Backend Files:"
backend_files=(
    "backend/app/main.py"
    "backend/app/models.py"
    "backend/app/db.py"
    "backend/app/seed.py"
    "backend/app/routers/roster.py"
    "backend/app/schemas/roster.py"
    "backend/app/services/roster_service.py"
    "backend/app/engine/roster_engine.py"
    "backend/app/services/roster_import.py"
)

for file in "${backend_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ MISSING: $file"
        ISSUES=$((ISSUES + 1))
    fi
done

# Check frontend files
echo ""
echo "Frontend Key Files:"
frontend_files=(
    "frontend/package.json"
    "frontend/vite.config.js"
    "frontend/src/App.jsx"
    "frontend/src/main.jsx"
    "frontend/src/services/api.js"
    "frontend/src/utils/colors.js"
    "frontend/src/components/atoms/Button.jsx"
)

for file in "${frontend_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ MISSING: $file"
        ISSUES=$((ISSUES + 1))
    fi
done

# Check dependencies
echo ""
echo "Dependencies:"

if command -v python3 &> /dev/null; then
    echo "✓ Python 3: $(python3 --version)"
else
    echo "✗ Python 3 not found"
    ISSUES=$((ISSUES + 1))
fi

if command -v node &> /dev/null; then
    echo "✓ Node.js: $(node --version)"
else
    echo "✗ Node.js not found"
    ISSUES=$((ISSUES + 1))
fi

if command -v npm &> /dev/null; then
    echo "✓ npm: $(npm --version)"
else
    echo "✗ npm not found"
    ISSUES=$((ISSUES + 1))
fi

# Check if backend dependencies are installed
echo ""
echo "Backend Dependencies:"
cd backend 2>/dev/null
if python3 -c "import fastapi" 2>/dev/null; then
    echo "✓ FastAPI installed"
else
    echo "✗ FastAPI not installed (run: pip install -r requirements.txt)"
    ISSUES=$((ISSUES + 1))
fi
cd ..

# Check if frontend dependencies are installed
echo ""
echo "Frontend Dependencies:"
if [ -d "frontend/node_modules" ]; then
    echo "✓ node_modules exists"
else
    echo "✗ node_modules not found (run: npm install in frontend/)"
    ISSUES=$((ISSUES + 1))
fi

# Summary
echo ""
echo "============================================"
if [ $ISSUES -eq 0 ]; then
    echo "✅ Setup looks good! You can start the servers."
    echo ""
    echo "Run: ./start-dev.sh"
    exit 0
else
    echo "⚠️  Found $ISSUES issue(s). Please fix them before starting."
    exit 1
fi
