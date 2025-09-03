import Registration from './pages/Registration'
import Login from './pages/Login'
import { Routes, Route } from "react-router-dom";


function App() {
  

  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;


    

