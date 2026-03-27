import { useState, useEffect } from "react";
import api from "../api/axios";
import LineItemModal from "./LineItemModal";
import "../styles/global.css";

export default function OrderPage() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeHeaderId, setActiveHeaderId] = useState(null);
  const [editingHeaderId, setEditingHeaderId] = useState(null);

  const fetchOrders = async () => {
    const res = await api.get("/api/orders");
    setOrders(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/auth/users");
    setUsers(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
    fetchUsers();
  }, []);

  const handleSaveHeader = async () => {
    if (!selectedUser) return alert("Select a user first!");

    if (editingHeaderId) {
      await api.put(`/api/orders/${editingHeaderId}`, {
        user: { id: selectedUser.id },
      });
      setEditingHeaderId(null);
    } else {
      await api.post("/api/orders", { user: { id: selectedUser.id } });
    }

    setSelectedUser(null);
    setUserSearch("");
    fetchOrders();
  };

  const handleEditClick = (order) => {
    setEditingHeaderId(order.id);
    setSelectedUser(order.user);
    setUserSearch(order.user?.username || "");
  };

  const handleDeleteHeader = async (id) => {
    if (window.confirm("Delete this order and all its lines?")) {
      await api.delete(`/api/orders/${id}`);
      fetchOrders();
    }
  };

  const handleDeleteLine = async (lineId) => {
    await api.delete(`/api/orders/lines/${lineId}`);
    fetchOrders();
  };

  const openLineEntry = (id) => {
    setActiveHeaderId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="card">
          <h2 style={{ color: "#333", marginBottom: "20px" }}>
            {editingHeaderId
              ? `Editing Order #${editingHeaderId}`
              : "Create Order Header"}
          </h2>

          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "400px",
              marginBottom: "15px",
            }}
          >
            <input
              className="form-input"
              placeholder="Type to search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={{ fontSize: "16px", padding: "12px" }}
            />

            {userSearch.length > 0 && selectedUser?.username !== userSearch && (
              <div className="search-dropdown">
                {users
                  .filter((u) =>
                    u.username.toLowerCase().includes(userSearch.toLowerCase()),
                  )
                  .slice(0, 10)
                  .map((u) => (
                    <div
                      key={u.id}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedUser(u);
                        setUserSearch(u.username);
                      }}
                      style={{
                        padding: "12px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      {u.username}
                    </div>
                  ))}
                {users.filter((u) =>
                  u.username.toLowerCase().includes(userSearch.toLowerCase()),
                ).length === 0 && (
                  <div
                    style={{ padding: "12px", color: "#999", fontSize: "14px" }}
                  >
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn-primary"
              onClick={handleSaveHeader}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              {editingHeaderId ? "Update Order Header" : "Create Order Header"}
            </button>
            {editingHeaderId && (
              <button
                className="btn-secondary"
                onClick={() => {
                  setEditingHeaderId(null);
                  setSelectedUser(null);
                  setUserSearch("");
                }}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: "#333", marginBottom: "20px", fontSize: "24px" }}>
            Orders List
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              className="data-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <th
                    style={{
                      padding: "15px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    Customer & Order Lines
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid #e0e0e0" }}
                  >
                    <td
                      style={{
                        padding: "15px",
                        fontSize: "15px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      #{order.id}
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                    <td style={{ padding: "15px" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <strong style={{ fontSize: "16px", color: "#2c3e50" }}>
                          {order.user?.username}
                        </strong>
                      </div>
                      {order.orderLines?.length > 0 ? (
                        <ul
                          style={{
                            marginTop: "8px",
                            listStyle: "none",
                            paddingLeft: 0,
                            backgroundColor: "#f8f9fa",
                            borderRadius: "6px",
                            padding: "8px",
                          }}
                        >
                          {order.orderLines?.map((line) => (
                            <li
                              key={line.id}
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #e0e0e0",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span style={{ fontSize: "14px", color: "#555" }}>
                                <strong>{line.item?.itemName}</strong>{" "}
                                <span style={{ color: "#888" }}>
                                  (x{line.quantity})
                                </span>
                              </span>
                              <button
                                onClick={() => handleDeleteLine(line.id)}
                                className="btn-danger"
                                style={{
                                  marginLeft: "10px",
                                  padding: "4px 12px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  borderRadius: "4px",
                                }}
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#999",
                            fontStyle: "italic",
                          }}
                        >
                          No items in order
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "15px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          className="btn-primary"
                          onClick={() => openLineEntry(order.id)}
                          style={{
                            padding: "8px 16px",
                            fontSize: "14px",
                            fontWeight: "600",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          ➕ Add Items
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => handleEditClick(order)}
                          style={{
                            padding: "8px 16px",
                            fontSize: "14px",
                            fontWeight: "600",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          ✏️ Edit User
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDeleteHeader(order.id)}
                          style={{
                            padding: "8px 16px",
                            fontSize: "14px",
                            fontWeight: "600",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "#999",
                        fontSize: "16px",
                      }}
                    >
                      No orders found. Create your first order above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <LineItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          headerId={activeHeaderId}
          onSave={fetchOrders}
        />
      </div>
    </div>
  );
}
