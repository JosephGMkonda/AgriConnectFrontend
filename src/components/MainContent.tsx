import { ReactNode , useState} from "react";
import { TopNavigation } from "../re-components/TopNavigation"
import { LeftSidebar } from "../re-components/LeftSidebar";
import { RightSidebar } from "../re-components/RightSideBar";
import { CreatePost } from './CreatePost';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  return (
    <div className="flex flex-col h-screen">
      
      <TopNavigation />

      <div className="flex flex-1 overflow-hidden">
        
        <div className="w-1/5 bg-gray-100 border-r overflow-y-auto">
          <LeftSidebar onNewPost={() => setShowCreatePost(true)}/>
        </div>

        
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

      
        <div className="w-1/5 bg-gray-50 border-l overflow-y-auto">
          <RightSidebar  onNewPost={() => setShowCreatePost(true)} />
        </div>
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

export default MainLayout;
