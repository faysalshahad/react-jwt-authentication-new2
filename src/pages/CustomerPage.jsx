import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link /* useNavigate*/ } from "react-router-dom";
import "../styles/global.css";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", address: "" });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const fetchCustomers = async () => {
    try {
      // Using the debounced value for the API call
      const res = await api.get("/api/customers?search=${debouncedSearch}");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  // Handle Debouncing for Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch]);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoading(true);
    try {
      await api.post("/api/customers", newCustomer);
      setNewCustomer({ name: "", address: "" });
      fetchCustomers();
      alert("Customer added successfully!");
    } catch (err) {
      console.error("Error adding customer", err);
      alert("Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await api.delete("/api/customers/${id}");
        fetchCustomers();
      } catch (err) {
        console.error(err);
        alert(
          "Failed to delete customer. They might be linked to existing orders.",
        );
      }
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      customer.id.toString() === debouncedSearch,
  );

  return (
    <div className="dashboard-container">
      {/* HEADER SECTION - Matching Items Page */}
      {/* <header className="dashboard-header">
        <h3>Customer Management</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/dashboard">
            <button className="btn-secondary">Dashboard</button>
          </Link>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header> */}

      <main className="dashboard-content">
        {/* ADMIN ONLY FORM - Styled as a Card */}
        {isAdmin && (
          <div className="card">
            <h3>Add New Customer</h3>
            <form onSubmit={handleAddCustomer}>
              <div className="form-group">
                <label>Customer Name:</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="form-input"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  placeholder="Enter physical address"
                  className="form-input"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Customer"}
              </button>
            </form>
          </div>
        )}

        {/* CUSTOMER LIST SECTION */}
        <div className="card">
          <h3>Customer List</h3>

          {/* SEARCH BAR SECTION */}
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  {isAdmin && <th style={{ textAlign: "center" }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td style={{ fontWeight: "600", color: "#2c3e50" }}>
                      {c.name}
                    </td>
                    <td>{c.address}</td>
                    {isAdmin && (
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="btn-danger"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td
                      colSpan={isAdmin ? "4" : "3"}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#999",
                      }}
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
