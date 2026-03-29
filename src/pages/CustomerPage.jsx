import { useState, useEffect } from "react";
import api from "../api/axios";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", address: "" });

  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const fetchCustomers = async () => {
    try {
      const res = await api.get(`/api/customers?search=${search}`);
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCustomers();
  }, [search]); // Refetch when search text changes

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/customers", newCustomer);
      setNewCustomer({ name: "", address: "" });
      fetchCustomers();
    } catch (err) {
      console.error("Error adding customer", err);
      alert("Failed to add customer");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this customer?")) {
      await api.delete(`/api/customers/${id}`);
      fetchCustomers();
    }
  };

  return (
    <div className="container">
      <h2>Customer Management</h2>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search customers by name..."
        className="auth-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

      {/* ADMIN ONLY FORM */}
      {isAdmin && (
        <form
          onSubmit={handleAddCustomer}
          className="card"
          style={{ marginBottom: "20px" }}
        >
          <h4>Add New Customer</h4>
          <input
            type="text"
            placeholder="Name"
            className="auth-input"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="auth-input"
            value={newCustomer.address}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, address: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "10px" }}
          >
            Save Customer
          </button>
        </form>
      )}

      {/* CUSTOMER LIST */}
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th>Name</th>
            <th>Address</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.address}</td>
              {isAdmin && (
                <td>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="logout-btn"
                    style={{ padding: "5px 10px" }}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
