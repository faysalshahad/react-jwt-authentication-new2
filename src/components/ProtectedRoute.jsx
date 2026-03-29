import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // We use a small flag in localStorage.
  // Even if a user manually changes this to 'true',
  // the Backend Cookies will still block them from seeing real data.
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
