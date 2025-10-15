import React from 'react';
import { Calendar, Award, AlertCircle } from 'lucide-react';
import { colors, SIZES } from '../../utils/constants';
import { DragDropCalendar } from '../organisms/DragDropCalendar';

export const DashboardView = ({ posts, shifts, onShiftMove, onShiftClick }) => (
  <div id="dashboard-panel" role="tabpanel" className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: colors.grey200 }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium" style={{ color: colors.grey600 }}>
            Total Posts
          </h3>
          <Award size={SIZES.icon.medium} style={{ color: colors.primary }} aria-hidden="true" />
        </div>
        <p className="text-3xl font-bold" style={{ color: colors.text }}>{posts.length}</p>
        <p className="text-sm mt-1" style={{ color: colors.grey500 }}>Active & rosterable</p>
      </div>

      <div className="bg-white rounded-lg border p-6" style={{ borderColor: colors.grey200 }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium" style={{ color: colors.grey600 }}>
            Shifts This Month
          </h3>
          <Calendar size={SIZES.icon.medium} style={{ color: colors.secondary }} aria-hidden="true" />
        </div>
        <p className="text-3xl font-bold" style={{ color: colors.text }}>{shifts.length}</p>
        <p className="text-sm mt-1" style={{ color: colors.grey500 }}>124 total planned</p>
      </div>

      <div className="bg-white rounded-lg border p-6" style={{ borderColor: colors.grey200 }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium" style={{ color: colors.grey600 }}>
            EWTD Compliance
          </h3>
          <AlertCircle size={SIZES.icon.medium} style={{ color: colors.success }} aria-hidden="true" />
        </div>
        <p className="text-3xl font-bold" style={{ color: colors.text }}>98%</p>
        <p className="text-sm mt-1" style={{ color: colors.grey500 }}>2 warnings</p>
      </div>
    </div>

    <DragDropCalendar 
      shifts={shifts} 
      onShiftMove={onShiftMove}
      onShiftClick={onShiftClick}
    />
  </div>
);
