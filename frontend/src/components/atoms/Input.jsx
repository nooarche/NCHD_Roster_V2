import React from 'react';
import { colors } from '../../utils/constants';

export const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error, 
  disabled = false 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium" style={{ color: colors.grey700 }}>
        {label} {required && <span style={{ color: colors.error }}>*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e)}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${label}-error` : undefined}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
      style={{ 
        color: colors.text,
        borderColor: error ? colors.error : colors.grey300,
        '--tw-ring-color': colors.primary,
      }}
    />
    {error && (
      <p 
        id={`${label}-error`}
        role="alert"
        className="text-xs"
        style={{ color: colors.error }}
      >
        {error}
      </p>
    )}
  </div>
);
