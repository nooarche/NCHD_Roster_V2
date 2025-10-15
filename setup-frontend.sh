set -e

echo "🚀 HSE NCHD Rostering System - Frontend Setup"
echo "=============================================="

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node found: $(node --version)"
echo "✓ npm found: $(npm --version)"

# Navigate to frontend directory
cd frontend || { echo "❌ frontend/ directory not found"; exit 1; }

echo ""
echo "📁 Creating directory structure..."
mkdir -p src/components/{atoms,molecules,organisms,views} src/services src/utils public
echo "✓ Directories created"

echo ""
echo "📦 Installing npm dependencies..."
if [ -f "package.json" ]; then
    npm install
else
    echo "⚠️  package.json not found. Creating one..."
    cat > package.json << 'EOF'
{
  "name": "hse-rostering-frontend",
  "version": "0.2.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
EOF
    npm install
fi
echo "✓ Dependencies installed"

echo ""
echo "⚙️  Creating configuration files..."

# Create .env if not exists
if [ ! -f ".env" ]; then
    cat > .env << EOF
REACT_APP_API_BASE=http://localhost:8000/api
EOF
    echo "✓ .env created"
fi

# Create vite.config.js if not exists
if [ ! -f "vite.config.js" ]; then
    cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
EOF
    echo "✓ vite.config.js created"
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure all files are copied from artifacts to frontend/src/"
echo "2. Start server with: npm run dev"
echo "3. Open browser at: http://localhost:5173"
