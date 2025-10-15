import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { colors, SHIFT_TYPES } from '../../utils/constants';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { AlertBanner } from '../molecules/AlertBanner';
import { sanitizeInput } from '../../utils/sanitize';

export const ShiftForm = ({ shift, posts, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    post_id: shift?.post_id || '',
    user_name: shift?.user_name || '',
    start_date: shift?.start_date || '',
    start_time: shift?.start_time || '09:00',
    end_date: shift?.end_date || '',
    end_time: shift?.end_time || '17:00',
    shift_type: shift?.shift_type || 'base',
  });

  const [validation, setValidation] = useState({ valid: true, warnings: [] });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    validateEWTD();
  }, [formData]);

  const validateEWTD = () => {
    const warnings = [];
    
    if (formData.start_date && formData.end_date && formData.start_time && formData.end_time) {
      const start = new Date(`${formData.start_date}T${formData.start_time}:00`);
      const end = new Date(`${formData.end_date}T${formData.end_time}:00`);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        warnings.push('❌ Invalid date/time format');
        setValidation({ valid: false, warnings });
        return;
      }

      const durationHours = (end - start) / (1000 * 60 * 60);

      if (durationHours > 24) {
        warnings.push('⚠️ Shift exceeds 24 hours - EWTD violation');
      }
      if (durationHours < 0) {
        warnings.push('❌ End time is before start time');
      }
      if (formData.shift_type === 'night_call' && durationHours < 8) {
        warnings.push('ℹ️ Night call typically 12-16 hours');
      }
      if (durationHours < 1) {
        warnings.push('⚠️ Shift duration seems too short');
      }
    }

    setValidation({
      valid: warnings.filter(w => w.includes('❌')).length === 0,
      warnings,
    });
  };

  const handleSubmit = async () => {
    if (!formData.post_id || !formData.user_name || !formData.start_date) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        user_name: sanitizeInput(formData.user_name),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Post"
          value={formData.post_id}
          onChange={(e) => setFormData({ ...formData, post_id: e.target.value })}
          options={[
            { value: '', label: 'Select post...' },
            ...posts.map(p => ({ value: p.id, label: p.title }))
          ]}
          required
        />
        <Input
          label="Staff Member"
          value={formData.user_name}
          onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
          placeholder="e.g. DLHG 1, Dr. Smith"
          required
        />
      </div>

      <Select
        label="Shift Type"
        value={formData.shift_type}
        onChange={(e) => setFormData({ ...formData, shift_type: e.target.value })}
        options={SHIFT_TYPES}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            label="Start Date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
          <Input
            label="Start Time"
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            label="End Date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            required
          />
          <Input
            label="End Time"
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            required
          />
        </div>
      </div>

      {validation.warnings.length > 0 && (
        <div className="space-y-2">
          {validation.warnings.map((warning, idx) => (
            <AlertBanner 
              key={idx} 
              type={warning.includes('❌') ? 'error' : warning.includes('⚠️') ? 'warning' : 'info'} 
              message={warning} 
            />
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.grey200 }}>
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!validation.valid || isSaving} loading={isSaving} icon={Save}>
          Save Shift
        </Button>
      </div>
    </div>
  );
};
