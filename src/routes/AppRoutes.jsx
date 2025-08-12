import {Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';

export default function AppRoutes() {
    return (
       
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
        </Routes>
        
    )
}