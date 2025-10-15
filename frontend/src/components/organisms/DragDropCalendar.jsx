import React, { useState, useMemo, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import { colors, SIZES } from '../../utils/constants';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { AlertBanner } from '../molecules/AlertBanner';

export const DragDropCalendar = ({ shifts, onShiftMove, onShiftClick }) => {
  const [draggedShift, setDraggedShift] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [grabbedShift, setGrabbedShift] = useState(null);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = [
    { label: 'Week 1', date: '14 Jul' },
    { label: 'Week 2', date: '21 Jul' },
    { label: 'Week 3', date: '28 Jul' },
    { label: 'Week 4', date: '04 Aug' },
  ];

  const shiftGrid = useMemo(() => {
    return weeks.map((week, wIdx) => 
      weekDays.map((day, dIdx) => {
        return shifts.filter(s => s.weekIdx === wIdx && s.dayIdx === dIdx);
      })
    );
  }, [shifts, weeks, weekDays]);

  const handleDragStart = (shift, e) => {
    setDraggedShift(shift);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (weekIdx, dayIdx, e) => {
    e.preventDefault();
    setHoveredCell(`${weekIdx}-${dayIdx}`);
  };

  const handleDrop = (weekIdx, dayIdx, e) => {
    e.preventDefault();
    if (draggedShift) {
      onShiftMove(draggedShift, weekIdx, dayIdx);
    }
    setDraggedShift(null);
    setHoveredCell(null);
  };

  const handleDragEnd = () => {
    setDraggedShift(null);
    setHoveredCell(null);
  };

  const handleShiftKeyDown = (shift, weekIdx, dayIdx, e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!grabbedShift) {
        setGrabbedShift({ shift, weekIdx, dayIdx });
        setSelectedCell(`${weekIdx}-${dayIdx}`);
      } else if (grabbedShift.shift.id === shift.id) {
        setGrabbedShift(null);
        setSelectedCell(null);
      }
    }
  };

  const handleCellKeyDown = (weekIdx, dayIdx, e) => {
    if (!grabbedShift) return;

    const currentWeek = parseInt(selectedCell?.split('-')[0] || 0);
    const currentDay = parseInt(selectedCell?.split('-')[1] || 0);

    let newWeek = currentWeek;
    let newDay = currentDay;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newDay = Math.max(0, currentDay - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newDay = Math.min(6, currentDay + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newWeek = Math.max(0, currentWeek - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newWeek = Math.min(weeks.length - 1, currentWeek + 1);
        break;
      case 'Enter':
        e.preventDefault();
        onShiftMove(grabbedShift.shift, weekIdx, dayIdx);
        setGrabbedShift(null);
        setSelectedCell(null);
        return;
      case 'Escape':
        e.preventDefault();
        setGrabbedShift(null);
        setSelectedCell(null);
        return;
      default:
        return;
    }

    setSelectedCell(`${newWeek}-${newDay}`);
  };

  return (
    <div className="bg-white rounded-lg border p-6" style={{ borderColor: colors.grey200 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
          Roster Calendar - Drag & Drop
        </h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="small" ariaLabel="Previous week">◄ Previous</Button>
          <Button variant="secondary" size="small" ariaLabel="Next week">Next ►</Button>
        </div>
      </div>

      {grabbedShift && (
        <div className="mb-4">
          <AlertBanner
            type="info"
            message={`Moving "${grabbedShift.shift.name}". Use arrow keys to navigate, Enter to drop, Escape to cancel.`}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th 
                className="border px-3 py-2 text-sm font-semibold text-left"
                style={{ borderColor: colors.grey200, backgroundColor: colors.grey50, color: colors.grey700 }}
              >
                Week
              </th>
              {weekDays.map(day => (
                <th 
                  key={day} 
                  className="border px-3 py-2 text-sm font-semibold text-center"
                  style={{ borderColor: colors.grey200, backgroundColor: colors.grey50, color: colors.grey700 }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIdx) => (
              <tr key={weekIdx}>
                <td 
                  className="border px-3 py-4 text-sm font-medium"
                  style={{ borderColor: colors.grey200, backgroundColor: colors.grey50, color: colors.grey700 }}
                >
                  <div>{week.label}</div>
                  <div className="text-xs font-normal" style={{ color: colors.grey500 }}>{week.date}</div>
                </td>
                {weekDays.map((day, dayIdx) => {
                  const cellKey = `${weekIdx}-${dayIdx}`;
                  const isHovered = hoveredCell === cellKey;
                  const isSelected = selectedCell === cellKey;
                  const cellShifts = shiftGrid[weekIdx][dayIdx];
                  
                  return (
                    <td
                      key={dayIdx}
                      className="border px-2 py-2 align-top transition-colors"
                      style={{ 
                        borderColor: colors.grey200,
                        backgroundColor: isSelected ? '#E3F2FD' : isHovered ? '#F5F5F5' : colors.white,
                        minHeight: '80px',
                        minWidth: '120px',
                      }}
                      onDragOver={(e) => handleDragOver(weekIdx, dayIdx, e)}
                      onDrop={(e) => handleDrop(weekIdx, dayIdx, e)}
                      onKeyDown={(e) => handleCellKeyDown(weekIdx, dayIdx, e)}
                      tabIndex={grabbedShift ? 0 : -1}
                      role="gridcell"
                      aria-label={`${week.label} ${day}, ${cellShifts.length} shifts`}
                    >
                      <div className="space-y-1">
                        {cellShifts.map((shift, idx) => {
                          const isGrabbed = grabbedShift?.shift.id === shift.id;
                          return (
                            <div
                              key={idx}
                              draggable
                              onDragStart={(e) => handleDragStart(shift, e)}
                              onDragEnd={handleDragEnd}
                              onClick={() => onShiftClick(shift)}
                              onKeyDown={(e) => handleShiftKeyDown(shift, weekIdx, dayIdx, e)}
                              tabIndex={0}
                              role="button"
                              aria-label={`${shift.name} shift, ${shift.time}. Press space to grab, enter to edit.`}
                              className="cursor-move border rounded px-2 py-1 text-xs hover:shadow-md transition-shadow"
                              style={{ 
                                backgroundColor: isGrabbed ? '#BBDEFB' : '#E3F2FD',
                                borderColor: isGrabbed ? colors.primary : '#90CAF9',
                                color: colors.text,
                                opacity: draggedShift?.id === shift.id ? 0.5 : 1,
                              }}
                            >
                              <div className="flex items-center gap-1">
                                <GripVertical size={12} style={{ color: colors.grey500 }} aria-hidden="true" />
                                <span className="font-medium">{shift.name}</span>
                              </div>
                              <div className="text-xs" style={{ color: colors.grey600 }}>
                                {shift.time}
                              </div>
                              {shift.type && (
                                <Badge variant={
                                  shift.type === 'Night Call' ? 'primary' : 
                                  shift.type === 'Day Call' ? 'warning' : 'success'
                                }>
                                  {shift.type}
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm" style={{ color: colors.grey600 }}>
        <div className="flex items-center gap-2">
          <GripVertical size={16} aria-hidden="true" />
          <span>Drag shifts to reassign</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border rounded" style={{ backgroundColor: '#E3F2FD', borderColor: '#90CAF9' }}></div>
          <span>Assigned shift</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border rounded" style={{ backgroundColor: colors.grey100, borderColor: colors.grey200 }}></div>
          <span>Drop zone (hover)</span>
        </div>
        <div className="text-xs" style={{ color: colors.grey500 }}>
          Keyboard: Space to grab, Arrow keys to move, Enter to drop
        </div>
      </div>
    </div>
  );
};
