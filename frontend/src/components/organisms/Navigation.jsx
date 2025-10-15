import React from 'react';
import { Calendar, Award, FileText } from 'lucide-react';
import { colors } from '../../utils/constants';

export const Navigation = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar },
    { id: 'posts', label: 'Posts', icon: Award },
    { id: 'roster', label: 'Roster', icon: FileText },
  ];

  return (
    <nav className="bg-white border-b" style={{ borderColor: colors.grey200 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1" role="tablist">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${item.id}-panel`}
                className="flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2"
                style={{
                  borderBottomColor: isActive ? colors.primary : 'transparent',
                  color: isActive ? colors.primary : colors.grey600,
                }}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
