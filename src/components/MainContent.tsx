
import React from 'react';
import { CreatePost } from './CreatePost';
import { PostFeed } from './PostFeed';

export const MainContent: React.FC = () => {
  return (
    <main className="flex-grow max-w-2xl mx-auto p-4 md:ml-64 lg:mr-80"> {/* Adjust margins for sidebars */}
    
      <CreatePost />
      
      
      <PostFeed />
    </main>
  );
};