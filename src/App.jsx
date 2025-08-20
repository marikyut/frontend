import AppRoutes from './routes/AppRoutes.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <> 
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}