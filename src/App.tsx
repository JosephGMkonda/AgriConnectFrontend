import Registration from './pages/Registration'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage';
import { Routes, Route } from "react-router-dom";


function App() {
  

  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProfilePage />} />
      
    </Routes>
  );
}

export default App;


    

