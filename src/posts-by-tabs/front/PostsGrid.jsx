import React from 'react';
import Post from '../posts/card-round/Post';

export default function PostsGrid (props) {
  const { attributes, posts, tab } = props;
  
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