import {Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Homepage from '../pages/Homepage.jsx';

export default function AppRoutes() {
    return (
       
        <Routes>
             
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/homepage" element={<Homepage />} />
           
        </Routes>
        
    )
}