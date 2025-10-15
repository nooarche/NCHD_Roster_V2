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
export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost/api';

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
