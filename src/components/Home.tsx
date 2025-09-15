import React, { useState } from 'react';
import { LeftSidebar } from '../re-components/LeftSidebar';
import { TopNavigation } from '../re-components/TopNavigation';
import { RightSidebar } from '../re-components/RightSidebar';
import { CreatePost } from './CreatePost';
import { Feed } from './Feed';


export const Home: React.FC = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      
      <TopNavigation onNewPost={() => setShowCreatePost(true)} />
      
      <div className="flex flex-grow pt-16"> 
        
        <LeftSidebar onNewPost={() => setShowCreatePost(true)} />
        
        
        <main className="flex-grow max-w-2xl mx-auto p-4">

          <div>
          

          <Feed/>
          </div>

        </main>

    
        <RightSidebar />
      </div>


          <CreatePost 
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={() => {
          
          setShowCreatePost(false);
        }}
      />
    </div>
  );
};
        
   