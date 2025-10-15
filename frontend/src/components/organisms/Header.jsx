import React from 'react';
import { Plus } from 'lucide-react';
import { colors } from '../../utils/constants';
import { SearchInput } from '../atoms/SearchInput';
import { Button } from '../atoms/Button';

export const Header = ({ searchQuery, onSearchChange, onNewShift }) => (
  <header className="bg-white border-b sticky top-0" style={{ borderColor: colors.grey200, zIndex: 50 }}>
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <span className="text-white font-bold text-xl">HSE</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
              NCHD Rostering System
            </h1>
            <p className="text-sm" style={{ color: colors.grey500 }}>Community Services</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SearchInput 
            placeholder="Search posts, shifts..." 
            value={searchQuery}
            onChange={onSearchChange}
          />
          <Button 
            variant="primary" 
            icon={Plus} 
            size="small"
            onClick={onNewShift}
            ariaLabel="Create new shift"
          >
            New Shift
          </Button>
        </div>
      </div>
    </div>
  </header>
);
