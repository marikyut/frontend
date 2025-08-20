import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Employee from "../pages/Employee.jsx";
import AddEmployee from "../pages/AddEmployee.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <Employee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-employee"
        element={
          <ProtectedRoute>
            <AddEmployee />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
