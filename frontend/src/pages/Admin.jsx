import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../services/api";
import "./Admin.css";

function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = getUserRole();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    available: true,
    image: "",
  });

  const loadFoods = async () => {
    try {
      const data = await apiRequest("/foods");
      setFoods(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load food items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && role === "admin") {
      apiRequest("/foods")
        .then((data) => {
          setFoods(data);
          setError("");
        })
        .catch((err) => setError(err.message || "Failed to load food items"))
        .finally(() => setLoading(false));
    }
  }, [token, role]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      available: true,
      image: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!formData.name.trim() || !formData.category.trim() || formData.price === "") {
      setError("Name, category, and price are required.");
      return;
    }

    const numericPrice = Number(formData.price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: numericPrice,
      description: formData.description.trim(),
      available: Boolean(formData.available),
      image: formData.image.trim(),
    };

    try {
      if (editingId) {
        await apiRequest(`/foods/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Food item updated successfully.");
      } else {
        await apiRequest("/foods", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Food item created successfully.");
      }

      resetForm();
      await loadFoods();
    } catch (err) {
      setError(err.message || "Operation failed.");
    }
  };

  const handleEditClick = (food) => {
    setError("");
    setMessage("");
    setEditingId(food._id);
    setFormData({
      name: food.name || "",
      category: food.category || "",
      price: food.price !== undefined ? food.price : "",
      description: food.description || "",
      available: food.available !== undefined ? food.available : true,
      image: food.image || "",
    });
  };

  const handleDeleteClick = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this food item?");
    if (!confirmed) return;

    try {
      setError("");
      setMessage("");
      await apiRequest(`/foods/${id}`, {
        method: "DELETE",
      });
      setMessage("Food item deleted successfully.");
      if (editingId === id) {
        resetForm();
      }
      await loadFoods();
    } catch (err) {
      setError(err.message || "Failed to delete food item.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!token) {
    return (
      <main className="admin-page" style={{ textAlign: "center", padding: "48px 16px" }}>
        <h1>Access Denied</h1>
        <p>You must be signed in to access the Admin Dashboard.</p>
        <Link to="/login" className="admin-nav-link">Go to Login</Link>
      </main>
    );
  }

  if (role !== "admin") {
    return (
      <main className="admin-page" style={{ textAlign: "center", padding: "48px 16px" }}>
        <h1>Access Denied</h1>
        <p>You do not have permission to access the Admin Dashboard.</p>
        <Link to="/menu" className="admin-nav-link">Go to Menu</Link>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage your restaurant food menu</p>
        </div>
        <nav className="admin-nav">
          <Link to="/menu" className="admin-nav-link">View Menu</Link>
          <button type="button" onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </nav>
      </header>

      {message && <div className="admin-message admin-message-success">{message}</div>}
      {error && <div className="admin-message admin-message-error">{error}</div>}

      <section className="admin-card">
        <h2>{editingId ? "Edit Food Item" : "Add New Food Item"}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-field">
              <label htmlFor="food-name">Food Name *</label>
              <input
                id="food-name"
                type="text"
                name="name"
                placeholder="e.g. Paneer Butter Masala"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="food-category">Category *</label>
              <input
                id="food-category"
                type="text"
                name="category"
                placeholder="e.g. Main Course, Snacks, Beverage"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="food-price">Price (₹) *</label>
              <input
                id="food-price"
                type="number"
                name="price"
                min="0"
                step="any"
                placeholder="e.g. 250"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-field">
            <label htmlFor="food-description">Description</label>
            <textarea
              id="food-description"
              name="description"
              rows="3"
              placeholder="Brief description of the food item"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-field">
              <label htmlFor="food-image">Image URL</label>
              <input
                id="food-image"
                type="text"
                name="image"
                placeholder="https://example.com/food.jpg"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>

            <div className="admin-form-field admin-checkbox-field">
              <label>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                />
                {" "}Available for ordering
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn-primary">
              {editingId ? "Update Food Item" : "Add Food Item"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-card">
        <h2>Existing Menu Items ({foods.length})</h2>
        {loading ? (
          <p>Loading food items...</p>
        ) : foods.length === 0 ? (
          <p>No food items found. Use the form above to add your first item.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id}>
                    <td>
                      <strong>{food.name}</strong>
                    </td>
                    <td>{food.category}</td>
                    <td>₹{food.price}</td>
                    <td>
                      <span className={`admin-badge ${food.available ? "admin-badge-available" : "admin-badge-unavailable"}`}>
                        {food.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td>{food.description || "-"}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-action-btn admin-edit-btn"
                          onClick={() => handleEditClick(food)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn admin-delete-btn"
                          onClick={() => handleDeleteClick(food._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Admin;
