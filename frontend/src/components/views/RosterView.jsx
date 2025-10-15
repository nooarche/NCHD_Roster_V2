import React from 'react';
import { Upload } from 'lucide-react';
import { colors } from '../../utils/constants';
import { Button } from '../atoms/Button';
import { DragDropCalendar } from '../organisms/DragDropCalendar';

export const RosterView = ({ shifts, onImportCSV, onGenerateRoster, onShiftMove, onShiftClick }) => (
  <div id="roster-panel" role="tabpanel" className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold" style={{ color: colors.text }}>
        Roster Management
      </h2>
      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          icon={Upload}
          onClick={onImportCSV}
          ariaLabel="Import roster from CSV"
        >
          Import CSV
        </Button>
        <Button 
          variant="primary" 
          onClick={onGenerateRoster}
          ariaLabel="Generate roster automatically"
        >
          Generate Roster
        </Button>
      </div>
    </div>

    <DragDropCalendar 
      shifts={shifts} 
      onShiftMove={onShiftMove}
      onShiftClick={onShiftClick}
    />
  </div>
);
