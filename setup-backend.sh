#!/bin/bash
set -e

echo "🚀 HSE NCHD Rostering System - Backend Setup (Fixed)"
echo "===================================================="

# Check for Python 3.12 specifically
if ! command -v python3.12 &> /dev/null; then
    echo "❌ Python 3.12 is not installed"
    echo "Please install Python 3.12 or use python3 if it's version 3.12"
    exit 1
fi

echo "✓ Python 3.12 found: $(python3.12 --version)"

cd backend || { echo "❌ backend/ directory not found"; exit 1; }

# Remove old venv completely
if [ -d "venv" ]; then
    echo "🗑️  Removing old virtual environment..."
    rm -rf venv
fi

# Create virtual environment with Python 3.12
echo "📦 Creating virtual environment with Python 3.12..."
python3.12 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip first
echo "📦 Upgrading pip..."
pip install --upgrade pip

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "🗄️  Initializing database..."
python -c "from app.db import Base, engine; Base.metadata.create_all(bind=engine)"

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "To start the server:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
