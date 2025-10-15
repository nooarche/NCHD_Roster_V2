import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { colors, SIZES } from '../../utils/constants';

export const AlertBanner = ({ type = 'info', message, onDismiss }) => {
  const types = {
    info: { bg: '#E3F2FD', border: '#90CAF9', text: '#1565C0', icon: colors.primary },
    warning: { bg: '#FFF3E0', border: '#FFB74D', text: '#E65100', icon: colors.warning },
    error: { bg: '#FFEBEE', border: '#E57373', text: '#C62828', icon: colors.error },
    success: { bg: '#E8F5E9', border: '#81C784', text: '#2E7D32', icon: colors.success },
  };

  const config = types[type];

  return (
    <div 
      className="border rounded-lg p-4 flex items-start gap-3"
      style={{ backgroundColor: config.bg, borderColor: config.border }}
      role="alert"
    >
      <AlertCircle size={SIZES.icon.medium} style={{ color: config.icon }} aria-hidden="true" />
      <p className="flex-1 text-sm" style={{ color: config.text }}>{message}</p>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="hover:opacity-70 transition-opacity"
          style={{ color: config.text }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
