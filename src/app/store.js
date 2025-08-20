import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeeReducer from "../features/employees/employeeSlice";
import authMiddleware from "../middleware/authMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

export default store;
