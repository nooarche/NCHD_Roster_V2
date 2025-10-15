import React from 'react';
import { colors } from '../../utils/constants';

export const Footer = () => (
  <footer className="bg-white border-t mt-12" style={{ borderColor: colors.grey200 }}>
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <span className="text-white font-bold text-sm">HSE</span>
          </div>
          <span className="text-sm" style={{ color: colors.grey600 }}>
            Health Service Executive - Community Services
          </span>
        </div>
        <div className="flex gap-4 text-sm" style={{ color: colors.grey600 }}>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Accessibility Statement</a>
          <a href="#" className="hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  </footer>
);
