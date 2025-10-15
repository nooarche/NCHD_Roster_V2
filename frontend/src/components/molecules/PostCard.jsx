import React from 'react';
import { Edit2, Trash2, MapPin, Clock, Award } from 'lucide-react';
import { colors, SIZES } from '../../utils/constants';
import { Badge } from '../atoms/Badge';
import { sanitizeInput } from '../../utils/sanitize';

export const PostCard = ({ post, onEdit, onDelete }) => (
  <div 
    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
    style={{ backgroundColor: colors.white, borderColor: colors.grey200 }}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-1" style={{ color: colors.text }}>
          {sanitizeInput(post.title)}
        </h3>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="primary">{post.grade}</Badge>
          <Badge variant={post.status === 'ACTIVE_ROSTERABLE' ? 'success' : 'default'}>
            {post.status}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(post)}
          aria-label={`Edit ${post.title}`}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Edit2 size={SIZES.icon.small} style={{ color: colors.grey600 }} />
        </button>
        <button 
          onClick={() => onDelete(post.id)}
          aria-label={`Delete ${post.title}`}
          className="p-1 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 size={SIZES.icon.small} style={{ color: colors.error }} />
        </button>
      </div>
    </div>
    <div className="space-y-2 text-sm" style={{ color: colors.grey600 }}>
      <div className="flex items-center gap-2">
        <MapPin size={14} aria-hidden="true" />
        <span>{post.site || 'Not specified'}</span>
      </div>
      {post.call_policy && (
        <div className="flex items-center gap-2">
          <Clock size={14} aria-hidden="true" />
          <span>Max {post.call_policy.max_nights_per_month} nights/month</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Award size={14} aria-hidden="true" />
        <span>FTE: {post.fte}</span>
      </div>
    </div>
  </div>
);
