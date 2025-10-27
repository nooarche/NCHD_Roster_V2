#!/bin/bash
set -e

echo "🚀 HSE NCHD Rostering System - Backend Setup"
echo "============================================="

# Check for Python 3.12 specifically
if ! command -v python3.12 &> /dev/null; then
    echo "❌ Python 3.12 is not installed"
    echo "Please install Python 3.12:"
    echo "  macOS: brew install python@3.12"
    echo "  Ubuntu: sudo apt install python3.12 python3.12-venv"
    exit 1
fi

echo "✓ Python 3.12 found: $(python3.12 --version)"

cd backend || { echo "❌ backend/ directory not found"; exit 1; }

# Remove old virtual environment if it exists
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

# Verify Python version in venv
echo "✓ Virtual environment using: $(python --version)"

echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "🗄️  Initializing database..."
python -c "from app.db import Base, engine; Base.metadata.create_all(bind=engine)"

echo "✅ Backend setup complete!"
echo ""
echo "To start the server:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload"
