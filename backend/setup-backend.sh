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
python
