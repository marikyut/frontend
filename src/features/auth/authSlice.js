import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";



// --- Helper: decode JWT ---
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (err) {
    return null;
  }
};

// ✅ Load stored session
const storedUser = localStorage.getItem("authUser");
const storedToken = localStorage.getItem("authToken");

// --- Check expiration if token exists ---
let isAuthenticated = false;
let validToken = null;

if (storedToken) {
  const decoded = decodeToken(storedToken);
  const now = Date.now() / 1000; // current time in seconds
  if (decoded && decoded.exp > now) {
    isAuthenticated = true;
    validToken = storedToken;
  } else {
    // expired → cleanup
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  }
}

// LOGIN THUNK
// This will handle the login process
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data; // { message, user, token }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: validToken,
    loading: false,
    error: null,
    successMessage: null,
    isAuthenticated,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.successMessage = null;
      state.error = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.successMessage = action.payload.message;
        state.isAuthenticated = true;

        // ✅ Save to localStorage
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("authUser", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
