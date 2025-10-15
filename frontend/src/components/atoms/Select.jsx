import React from 'react';
import { colors } from '../../utils/constants';

export const Select = ({ 
  label, 
  value, 
  onChange, 
  options, 
  required = false, 
  disabled = false 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium" style={{ color: colors.grey700 }}>
        {label} {required && <span style={{ color: colors.error }}>*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
      style={{ 
        color: colors.text,
        borderColor: colors.grey300,
        '--tw-ring-color': colors.primary,
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);
