# Setup Scripts Documentation

## Available Scripts

### 1. setup-backend.sh
Sets up the backend environment:
- Checks Python installation
- Installs dependencies
- Creates directory structure
- Initializes database

Usage:
```bash
chmod +x setup-backend.sh
./setup-backend.sh
```

### 2. setup-frontend.sh
Sets up the frontend environment:
- Checks Node.js installation
- Installs npm dependencies
- Creates directory structure
- Creates config files

Usage:
```bash
chmod +x setup-frontend.sh
./setup-frontend.sh
```

### 3. start-dev.sh
Starts both backend and frontend servers in development mode:
- Starts backend on port 8000
- Starts frontend on port 5173
- Handles graceful shutdown

Usage:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

Press Ctrl+C to stop both servers.

### 4. test-integration.sh
Tests the integration between frontend and backend:
- Tests health endpoint
- Tests CRUD operations
- Tests roster generation
- Tests EWTD validation

Usage:
```bash
chmod +x test-integration.sh
./test-integration.sh
```

### 5. check-setup.sh
Verifies that all files are in place:
- Checks backend files exist
- Checks frontend files exist
- Checks dependencies installed

Usage:
```bash
chmod +x check-setup.sh
./check-setup.sh
```

## Quick Start Workflow

```bash
# 1. Check setup
./check-setup.sh

# 2. Setup backend (if needed)
./setup-backend.sh

# 3. Setup frontend (if needed)
./setup-frontend.sh

# 4. Copy all files from artifacts

# 5. Test integration
./test-integration.sh

# 6. Start development servers
./start-dev.sh
```

## Troubleshooting

If any script fails:
1. Check the error message
2. Ensure Python 3.8+ is installed
3. Ensure Node.js 18+ is installed
4. Ensure all files are copied from artifacts
5. Run check-setup.sh to identify missing files

## Manual Setup

If scripts don't work, follow the manual setup in quick-start-guide.md
