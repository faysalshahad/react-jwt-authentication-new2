import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const res = await api.post("/auth/login", user);
  //     localStorage.setItem("accessToken", res.data.accessToken);
  //     localStorage.setItem("refreshToken", res.data.refreshToken);
  //     localStorage.setItem("username", user.username);
  //     navigate("/dashboard");
  //   } catch (err) {
  //     alert("Login Failed: " + (err.response?.data?.message || "Error"));
  //   } finally {
  //     setLoading(false);
  //   }

  const handleLogin = async (e) => {
    // Prevent page reload
    e.preventDefault();
    setLoading(true);
    try {
      // Send the user object (username & password)
      // withCredentials: true is handled globally in your axios.js
      // The backend now returns a message and potentially user info, but NO tokens in body
      const res = await api.post("/auth/login", user);

      // Set UI Flags
      localStorage.setItem("isLoggedIn", "true");
      // Success! The cookies are already set in the browser.
      // Optional: Store just the username for the UI (not security)
      localStorage.setItem("username", user.username);

      // Store the role returned from backend (e.g., "ROLE_ADMIN")
      // Ensure your backend AuthResponse includes a 'role' field
      if (res.data.role) {
        localStorage.setItem("role", res.data.role);
      }
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      // alert("Login failed");
      alert(
        "Login Failed: " +
          (err.response?.data?.message || "Invalid Credentials"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="auth-input-group">
            <input
              type="text"
              className="auth-input"
              placeholder="Username"
              value={user.username} // Controlled component
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
          </div>
          <div className="auth-input-group">
            <input
              type="password"
              className="auth-input"
              placeholder="Password"
              value={user.password} // Controlled component
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* <div className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div> */}
      </div>
    </div>
  );
}
