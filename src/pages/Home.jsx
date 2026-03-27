import { Link } from "react-router-dom";
import "../styles/global.css";

export default function Home() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Welcome!</h1>
        <p style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
          Please login to access your personalized dashboard and features.
        </p>
        <Link to="/login">
          <button className="auth-button">Go to Login</button>
        </Link>
      </div>
    </div>
  );
}
