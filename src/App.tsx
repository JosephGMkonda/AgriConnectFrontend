import React, {useEffect} from 'react';
import Registration from './pages/Registration';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/Userprofilepage';
import FindFriendspage from './pages/FindFriendspage';
import NotificationPage from './pages/NoficationPage';
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './components/MainContent'
import { useAppDispatch, useAppSelector } from './store/hook';
import { fetchUser } from './Slices/AuthSlice';

function App() {

  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser()); 
    }
  }, [token, user, dispatch])


  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />

    
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <HomePage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
        
            <ProfilePage />
          
        </ProtectedRoute>
      } />

      <Route path="/user-profile" element={
        <ProtectedRoute>
          <MainLayout>
            <UserProfilePage />
          </MainLayout>
        </ProtectedRoute>
      } />

        <Route path="/friends" element={
        <ProtectedRoute>
          <MainLayout>
            <FindFriendspage />
          </MainLayout>
        </ProtectedRoute>
      } />

         <Route path="/notifications" element={
        <ProtectedRoute>
          <MainLayout>
            <NotificationPage />
          </MainLayout>
        </ProtectedRoute>
      } />
    </Routes>



  );
}

export default App;
