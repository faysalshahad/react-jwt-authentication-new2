import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";

export default function Items() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemName: "", itemDescription: "" });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const res = await api.get("/api/items");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/items", newItem);
      setNewItem({ itemName: "", itemDescription: "" });
      fetchItems();
      alert("Item created successfully!");
    } catch (err) {
      alert(
        "Failed to create item: " + (err.response?.data?.message || "Error"),
      );
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

  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.id.toString() === debouncedSearch,
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h3>Item Management</h3>
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
      </header>

      <main className="dashboard-content">
        <div className="card">
          <h3>Create New Item</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Item Name:</label>
              <input
                className="form-input"
                placeholder="Enter item name"
                value={newItem.itemName}
                onChange={(e) =>
                  setNewItem({ ...newItem, itemName: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <input
                className="form-input"
                placeholder="Enter description"
                value={newItem.itemDescription}
                onChange={(e) =>
                  setNewItem({ ...newItem, itemDescription: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Item"}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Item List</h3>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Search by Name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>Created By</th>
                  <th>Creator ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.itemName}</td>
                    <td>{item.itemDescription}</td>
                    <td>{item.createdBy?.username || "N/A"}</td>
                    <td>{item.createdBy?.id || "N/A"}</td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      No items found
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
