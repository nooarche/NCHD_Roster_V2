import React from 'react';
import { Loader } from 'lucide-react';
import { colors, SIZES } from '../../utils/constants';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  icon: Icon, 
  disabled = false, 
  loading = false, 
  ariaLabel 
}) => {
  const baseStyles = {
    borderRadius: '0.5rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'center',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.5 : 1,
  };

  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
    },
    secondary: {
      backgroundColor: colors.white,
      color: colors.primary,
      border: `2px solid ${colors.primary}`,
    },
    success: {
      backgroundColor: colors.success,
      color: colors.white,
      border: 'none',
    },
    danger: {
      backgroundColor: colors.error,
      color: colors.white,
      border: 'none',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      className={SIZES.button[size]}
      style={{ ...baseStyles, ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') e.target.style.backgroundColor = colors.primaryDark;
          else if (variant === 'success') e.target.style.backgroundColor = '#43A047';
          else if (variant === 'danger') e.target.style.backgroundColor = '#C62828';
          else if (variant === 'secondary') e.target.style.backgroundColor = colors.grey50;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.backgroundColor = variantStyles[variant].backgroundColor;
        }
      }}
    >
      {loading ? <Loader size={SIZES.icon.medium} className="animate-spin" /> : Icon && <Icon size={SIZES.icon.medium} />}
      {children}
    </button>
  );
};
