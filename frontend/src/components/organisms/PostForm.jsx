import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { colors, GRADES, POST_STATUSES } from '../../utils/constants';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Checkbox } from '../atoms/Checkbox';
import { Button } from '../atoms/Button';
import { sanitizeInput, deepClone } from '../../utils/sanitize';

export const PostForm = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    site: post?.site || '',
    grade: post?.grade || 'Registrar',
    fte: post?.fte || 1.0,
    status: post?.status || 'ACTIVE_ROSTERABLE',
    participates_in_call: post?.call_policy?.participates_in_call ?? true,
    max_nights_per_month: post?.call_policy?.max_nights_per_month || 7,
    min_rest_hours: post?.call_policy?.min_rest_hours || 11,
    core_hours: post?.core_hours || {
      MON: [['09:00', '17:00']],
      TUE: [['09:00', '17:00']],
      WED: [['09:00', '17:00']],
      THU: [['09:00', '17:00']],
      FRI: [['09:00', '16:00']],
    },
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.site.trim()) newErrors.site = 'Site is required';
    if (formData.max_nights_per_month < 1 || formData.max_nights_per_month > 31) {
      newErrors.max_nights_per_month = 'Must be between 1 and 31';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSaving(true);

    const payload = {
      title: sanitizeInput(formData.title),
      site: sanitizeInput(formData.site),
      grade: formData.grade,
      fte: parseFloat(formData.fte),
      status: formData.status,
      core_hours: formData.core_hours,
      eligibility: {
        call_policy: {
          role: 'NCHD',
          participates_in_call: formData.participates_in_call,
          min_rest_hours: parseInt(formData.min_rest_hours),
          max_nights_per_month: parseInt(formData.max_nights_per_month),
          day_call_allowed_when_on_site: true,
          night_call_requires_next_day_rest: true,
        },
        constraints: {
          max_consecutive_days: 6,
          min_rest_between_shifts_hours: parseInt(formData.min_rest_hours),
        },
      },
    };

    try {
      await onSave(payload);
    } finally {
      setIsSaving(false);
    }
  };

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Post Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Newcastle NCHD 1"
          required
          error={errors.title}
        />
        <Input
          label="Site"
          value={formData.site}
          onChange={(e) => setFormData({ ...formData, site: e.target.value })}
          placeholder="e.g. Newcastle"
          required
          error={errors.site}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Select
          label="Grade"
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          options={GRADES}
          required
        />
        <Input
          label="FTE"
          type="number"
          step="0.1"
          min="0.1"
          max="1.0"
          value={formData.fte}
          onChange={(e) => setFormData({ ...formData, fte: e.target.value })}
          required
        />
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          options={POST_STATUSES}
          required
        />
      </div>

      <div className="border-t pt-4" style={{ borderColor: colors.grey200 }}>
        <h3 className="font-semibold mb-4" style={{ color: colors.text }}>Call Policy</h3>
        <div className="space-y-4">
          <Checkbox
            label="Participates in on-call rota"
            checked={formData.participates_in_call}
            onChange={(e) => setFormData({ ...formData, participates_in_call: e.target.checked })}
          />
          {formData.participates_in_call && (
            <div className="grid grid-cols-2 gap-4 ml-6">
              <Input
                label="Max Nights per Month"
                type="number"
                min="1"
                max="31"
                value={formData.max_nights_per_month}
                onChange={(e) => setFormData({ ...formData, max_nights_per_month: e.target.value })}
                error={errors.max_nights_per_month}
              />
              <Input
                label="Min Rest Hours"
                type="number"
                min="8"
                max="24"
                value={formData.min_rest_hours}
                onChange={(e) => setFormData({ ...formData, min_rest_hours: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-4" style={{ borderColor: colors.grey200 }}>
        <h3 className="font-semibold mb-4" style={{ color: colors.text }}>Core Hours</h3>
        <div className="space-y-2">
          {daysOfWeek.map(day => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-12 text-sm font-medium" style={{ color: colors.grey700 }}>{day}</span>
              <input
                type="time"
                value={formData.core_hours[day]?.[0]?.[0] || '09:00'}
                onChange={(e) => {
                  const newHours = deepClone(formData.core_hours);
                  if (!newHours[day]) newHours[day] = [['09:00', '17:00']];
                  newHours[day][0][0] = e.target.value;
                  setFormData({ ...formData, core_hours: newHours });
                }}
                className="px-3 py-1 border rounded"
                style={{ borderColor: colors.grey300 }}
              />
              <span>to</span>
              <input
                type="time"
                value={formData.core_hours[day]?.[0]?.[1] || '17:00'}
                onChange={(e) => {
                  const newHours = deepClone(formData.core_hours);
                  if (!newHours[day]) newHours[day] = [['09:00', '17:00']];
                  newHours[day][0][1] = e.target.value;
                  setFormData({ ...formData, core_hours: newHours });
                }}
                className="px-3 py-1 border rounded"
                style={{ borderColor: colors.grey300 }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.grey200 }}>
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} loading={isSaving} icon={Save}>
          Save Post
        </Button>
      </div>
    </div>
  );
};
