import React from 'react';
import Post from '../posts/Post';

export default function PostsGrid (props) {
  const { posts } = props;
  
  if (!Array.isArray(posts) || posts.length === 0) {
    return null;
  }

  return (
    <div className="py-4 flex flex-wrap gap-0">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};