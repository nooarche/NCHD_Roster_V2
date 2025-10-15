set -e  # Exit on error

echo "🚀 HSE NCHD Rostering System - Backend Setup"
echo "============================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✓ Python found: $(python3 --version)"

# Navigate to backend directory
cd backend || { echo "❌ backend/ directory not found"; exit 1; }

echo ""
echo "📦 Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
    echo "✓ Dependencies installed"
else
    echo "⚠️  requirements.txt not found. Creating one..."
    cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-dateutil==2.8.2
psycopg2-binary==2.9.9
python-multipart==0.0.6
EOF
    pip3 install -r requirements.txt
    echo "✓ Dependencies installed"
fi

echo ""
echo "📁 Creating directory structure..."
mkdir -p app/schemas app/services app/routers app/engine
echo "✓ Directories created"

echo ""
echo "🗄️  Initializing database..."
python3 << EOF
try:
    from app.db import Base, engine
    Base.metadata.create_all(bind=engine)
    print("✓ Database initialized")
except Exception as e:
    print(f"⚠️  Database initialization skipped: {e}")
EOF

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure all files are copied from artifacts to backend/app/"
echo "2. Start server with: uvicorn app.main:app --reload"
echo "3. Test with: curl http://localhost:8000/health"
