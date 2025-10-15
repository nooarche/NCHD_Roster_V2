// Color palette
export const colors = {
  primary: '#0076BD',
  primaryDark: '#005A8F',
  secondary: '#00A3A1',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#D32F2F',
  background: '#F5F7FA',
  white: '#FFFFFF',
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey200: '#E5E5E5',
  grey300: '#D4D4D4',
  grey400: '#A3A3A3',
  grey500: '#737373',
  grey600: '#525252',
  grey700: '#404040',
  text: '#1A1A1A',
};

// Size constants for consistent sizing
export const SIZES = {
  icon: { 
    small: 16, 
    medium: 20, 
    large: 24 
  },
  button: { 
    small: 'px-3 py-1.5 text-sm', 
    medium: 'px-4 py-2', 
    large: 'px-6 py-3 text-lg' 
  },
};

// API Configuration
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

// Shift types
export const SHIFT_TYPES = [
  { value: 'base', label: 'Base/Day Shift' },
  { value: 'night_call', label: 'Night Call' },
  { value: 'day_call', label: 'Day Call' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'supervision', label: 'Supervision' },
];

// Post grades
export const GRADES = [
  { value: 'Registrar', label: 'Registrar' },
  { value: 'SHO', label: 'SHO' },
  { value: 'Intern', label: 'Intern' },
  { value: 'BST Trainee', label: 'BST Trainee' },
  { value: 'GP Trainee', label: 'GP Trainee' },
];

// Post statuses
export const POST_STATUSES = [
  { value: 'ACTIVE_ROSTERABLE', label: 'Active - Rosterable' },
  { value: 'VACANT_UNROSTERABLE', label: 'Vacant - Unrosterable' },
];
