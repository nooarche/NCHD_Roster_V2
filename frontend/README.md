# HSE NCHD Rostering System - Frontend

## Overview
Frontend application for the HSE NCHD Rostering & Leave System built with React and Vite.

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── atoms/          # Basic UI elements (Button, Input, etc.)
│   │   ├── molecules/      # Simple compounds (Modal, AlertBanner, etc.)
│   │   ├── organisms/      # Complex components (Forms, Calendar, etc.)
│   │   └── views/          # Page-level components
│   ├── utils/              # Utilities and custom hooks
│   ├── services/           # API service layer
│   ├── App.jsx            # Main application
│   ├── ErrorBoundary.jsx   # Error handling
│   └── main.jsx           # Entry point
├── public/
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:5173

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env` file:
```
REACT_APP_API_BASE=http://localhost/api
```

## Architecture

### Atomic Design
Components follow Atomic Design principles:
- **Atoms**: Basic building blocks (Button, Input, Badge)
- **Molecules**: Simple groups (Modal, AlertBanner, PostCard)
- **Organisms**: Complex components (PostForm, DragDropCalendar)
- **Views**: Full page layouts

### Key Features
- ✅ Post management with EWTD validation
- ✅ Drag & drop roster calendar with keyboard support
- ✅ CSV import with parsing
- ✅ Real-time shift validation
- ✅ Full accessibility (ARIA, keyboard navigation)
- ✅ Error boundaries and loading states
- ✅ HSE brand compliance

## API Integration

Update `src/services/api.js` to connect to your backend:
```javascript
// Already configured to use API_BASE from environment
// Just update .env file with your API URL
```

## Accessibility
- Full keyboard navigation
- ARIA labels on all interactive elements
- Screen reader support
- Focus management in modals
- Color contrast compliance (WCAG AA)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing
1. Follow Atomic Design patterns
2. Add prop-types for type checking
3. Include accessibility attributes
4. Test keyboard navigation
5. Update tests for new features

## License
Proprietary - Health Service Executive
