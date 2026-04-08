import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
//import { toast } from "react-toastify"; // 1. Import it

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Capture the 'res' (response) from the backend
      // const res = await api.post("/auth/register", form);

      // 2. Use the message from your AuthResponse (res.data.message)
      // alert(res.data.message);
      // toast.success(res.data.message); // 2. Nice green toast

      await api.post("/auth/register", form);
      alert("User Registered Successfully!");
      navigate("/login");
    } catch (err) {
      // 3. Capture the error message from your backend catch blocks
      // This will now show "User already exists" instead of a generic "Failed"
      // const errorMessage = err.response?.data?.message || "Registration Failed";
      // alert(errorMessage);
      // toast.error(msg); // 3. Nice red toast

      console.log(err);
      alert("Registration Failed. Are you a Super Admin?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="auth-input-group">
            <input
              type="text"
              className="auth-input"
              placeholder="Username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="auth-input-group">
            <input
              type="password"
              className="auth-input"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="auth-input-group">
            <select
              className="auth-select"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
