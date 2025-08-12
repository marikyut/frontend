import {Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';

export default function AppRoutes() {
    return (
       
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
        </Routes>
        
    )
}