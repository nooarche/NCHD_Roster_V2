import React from 'react';
import { colors } from '../../utils/constants';

export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: { backgroundColor: colors.grey200, color: colors.grey700 },
    primary: { backgroundColor: '#E3F2FD', color: '#1565C0' },
    success: { backgroundColor: '#E8F5E9', color: '#2E7D32' },
    warning: { backgroundColor: '#FFF3E0', color: '#E65100' },
    danger: { backgroundColor: '#FFEBEE', color: '#C62828' },
  };

  return (
    <span 
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={variants[variant]}
    >
      {children}
    </span>
  );
};
