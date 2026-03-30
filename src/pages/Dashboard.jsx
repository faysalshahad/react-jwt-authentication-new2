// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
import { Link } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
import "../styles/global.css";

export default function Dashboard() {
  // const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("role") || ""; // Get role from local storage

  // let userRole = "";
  // if (token) {
  //   try {
  //     const decoded = jwtDecode(token);
  //     userRole = decoded.roles;
  //   } catch (error) {
  //     console.error("Invalid token:", error);
  //   }
  // }

  // const handleLogout = async () => {
  //   try {
  //     await api.post("/logout");
  //   } finally {
  //     localStorage.clear();
  //     navigate("/");
  //   }
  // };

  // const handleLogout = async () => {
  //   try {
  //     // Tell backend to clear cookies
  //     await api.post("/auth/logout");
  //   } catch (err) {
  //     console.error("Logout request failed", err);
  //   } finally {
  //     // Always clear UI data and redirect
  //     localStorage.removeItem("isLoggedIn");
  //     localStorage.removeItem("username");
  //     localStorage.removeItem("role");

  //     // Force a full reload to the login page to clear any memory states
  //     window.location.href = "/login";
  //   }
  // };

  // const handleLogout = async () => {
  //   try {
  //     // Tell the backend to clear cookies
  //     await api.post("/auth/logout");

  //     // Clear UI-specific data
  //     localStorage.removeItem("username");

  //     // Redirect to login
  //     navigate("/login");
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //     // Even if the request fails, clear local storage and redirect
  //     localStorage.clear();
  //     navigate("/login");
  //   }
  // };

  const isAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h3>Welcome, {username}!</h3>
        {/* <button onClick={handleLogout} className="logout-btn">
          Logout
        </button> */}
      </header>
      <main className="dashboard-content">
        <div className="card">
          <h3>Quick Actions</h3>
          <Link to="/orders">
            <button className="btn-primary">Place an Order</button>
          </Link>
        </div>

        {isAdmin ? (
          <div className="card">
            <h4>Administrative Tools</h4>
            <p>
              As an {userRole.replace("ROLE_", "")}, you can add new users and
              manage items in the system.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <Link to="/register">
                <button className="btn-primary">Register New User</button>
              </Link>
              <Link to="/items">
                <button className="btn-primary">Manage Items</button>
              </Link>
              <Link to="/customers">
                <button className="btn-primary">Manage Customers</button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            <p>
              Standard user view: You do not have permission to register new
              users.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
