import { logout } from "../features/auth/authSlice";

// --- Helper: decode JWT ---
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch {
    return null;
  }
};

const authMiddleware = (store) => (next) => (action) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    const decoded = decodeToken(token);
    const now = Date.now() / 1000;

    if (!decoded || decoded.exp < now) {
      // ⛔ Token expired → logout
      store.dispatch(logout());
      return; // stop action
    }
  }

  return next(action);
};

export default authMiddleware;
