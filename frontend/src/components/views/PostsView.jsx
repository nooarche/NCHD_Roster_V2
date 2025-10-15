import React from 'react';
import { Plus, Award } from 'lucide-react';
import { colors } from '../../utils/constants';
import { Button } from '../atoms/Button';
import { PostCard } from '../molecules/PostCard';

export const PostsView = ({ posts, onCreatePost, onEditPost, onDeletePost }) => (
  <div id="posts-panel" role="tabpanel" className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold" style={{ color: colors.text }}>
        Post Management
      </h2>
      <Button 
        variant="primary" 
        icon={Plus}
        onClick={onCreatePost}
        ariaLabel="Create new post"
      >
        Create Post
      </Button>
    </div>
    
    {posts.length === 0 ? (
      <div className="bg-white rounded-lg border p-12 text-center" style={{ borderColor: colors.grey200 }}>
        <Award size={48} className="mx-auto mb-4" style={{ color: colors.grey300 }} aria-hidden="true" />
        <p className="text-lg font-medium mb-2" style={{ color: colors.grey700 }}>
          No posts yet
        </p>
        <p className="text-sm mb-4" style={{ color: colors.grey500 }}>
          Create your first post to get started
        </p>
        <Button 
          variant="primary" 
          icon={Plus}
          onClick={onCreatePost}
        >
          Create Post
        </Button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post}
            onEdit={onEditPost}
            onDelete={onDeletePost}
          />
        ))}
      </div>
    )}
  </div>
);
