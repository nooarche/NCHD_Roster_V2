import React from 'react';
import { Search } from 'lucide-react';
import { colors, SIZES } from '../../utils/constants';
import { useDebounce } from '../../utils/hooks';

export const SearchInput = ({ placeholder = "Search...", value, onChange }) => {
  const debouncedValue = useDebounce(value, 300);
  
  return (
    <div className="relative">
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2" 
        size={SIZES.icon.medium}
        style={{ color: colors.grey400 }}
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label={placeholder}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
        style={{ 
          color: colors.text,
          borderColor: colors.grey300,
          '--tw-ring-color': colors.primary,
        }}
      />
    </div>
  );
};
