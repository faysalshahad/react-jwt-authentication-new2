import { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/global.css";

export default function LineItemModal({ isOpen, onClose, headerId, onSave }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchItems = async () => {
    try {
      const res = await api.get("/auth/items");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items", err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchItems();
  }, [isOpen]);

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const handleAdd = async () => {
    if (!selectedItem) {
      alert("Please select an item");
      return;
    }

    setLoading(true);
    try {
      const lineData = {
        item: { id: selectedItem.id },
        quantity: parseInt(quantity),
      };

      await api.post(`/auth/orders/${headerId}/lines`, lineData);
      setSearch("");
      setSelectedItem(null);
      setQuantity(1);
      onSave();
      onClose();
    } catch (err) {
      alert("Failed to add item: " + (err.response?.data?.message || "Error"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: "20px" }}>Add Items to Order #{headerId}</h3>

        <div className="form-group" style={{ position: "relative" }}>
          <label>Search Item:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Type item name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search.length > 0 && selectedItem?.itemName !== search && (
            <div className="search-dropdown">
              {filteredItems.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedItem(item);
                    setSearch(item.itemName);
                  }}
                >
                  {item.itemName} (ID: {item.id})
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div style={{ padding: "10px", color: "#999" }}>
                  No items found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Quantity: </label>
          <input
            type="number"
            className="form-input"
            style={{
              width: "100px",
              display: "inline-block",
              marginLeft: "10px",
            }}
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
