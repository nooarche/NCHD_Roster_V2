import React from 'react';
import { colors } from '../../utils/constants';

export const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded focus:ring-2"
      style={{ 
        accentColor: colors.primary,
        '--tw-ring-color': colors.primary,
      }}
    />
    <span className="text-sm" style={{ color: colors.grey700 }}>{label}</span>
  </label>
);
