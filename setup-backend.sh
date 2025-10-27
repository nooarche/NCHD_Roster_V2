#!/bin/bash
set -e

echo "🚀 HSE NCHD Rostering System - Backend Setup"
echo "============================================="

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

echo "✓ Python found: $(python3 --version)"

cd backend || { echo "❌ backend/ directory not found"; exit 1; }

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "🗄️  Initializing database..."
python -c "from app.db import Base, engine; Base.metadata.create_all(bind=engine)"

echo "✅ Backend setup complete!"
echo ""
echo "To start the server:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo ""
echo "  # Development mode (with auto-reload)"
echo "  uvicorn app.main:app --reload --reload-dir ./app --host 0.0.0.0 --port 8000"
echo ""
echo "  # OR Production mode (without auto-reload)"
echo "  uvicorn app.main:app --host 0.0.0.0 --port 8000"
