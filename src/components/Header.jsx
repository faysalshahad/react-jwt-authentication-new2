import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  // Based on your screenshot, 'role' is stored directly as a string in localStorage
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear(); // Clears role, username, and isLoggedIn
    navigate("/login");
  };

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return (
    <header className="main-header">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/dashboard">OrderSystem</Link>
        </div>

        <nav className="nav-menu">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>

          {isAdmin && (
            <>
              <Link className="nav-link" to="/items">
                Items
              </Link>
              <Link className="nav-link" to="/orders">
                Orders
              </Link>
              <Link className="nav-link" to="/customers">
                Customers
              </Link>
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>

        <div className="nav-actions">
          <span className="user-badge">{role}</span>
          <button className="logout-button-nav" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
