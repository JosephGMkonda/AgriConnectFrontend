import Registration from './pages/Registration'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import { Routes, Route } from "react-router-dom";
import {ProtectedRoute} from './components/ProtectedRoute';


function App() {
  

  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />


      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />

    </Routes>
  );
}

export default App;


    

