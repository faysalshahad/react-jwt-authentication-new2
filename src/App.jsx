import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import OrderPage from "./pages/OrderPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerPage from "./pages/CustomerPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/items" element={<Items />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/customers" element={<CustomerPage />} />

        {/* Protected Routes */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<Items />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/customers" element={<CustomerPage />} />
        </Route> */}

        {/* Default redirect */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
