import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../services/api";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    apiRequest("/foods")
      .then(data => setFoods(data))
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1>Menu</h1>
        <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/admin">Admin Dashboard</Link>
          {token ? (
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      {loading && <p>Loading menu...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && foods.length === 0 && <p>No food items available.</p>}

      {!loading && !error && foods.map(food => (
        <div key={food._id} style={{ borderBottom: "1px solid var(--color-border)", padding: "16px 0" }}>
          <h2>{food.name}</h2>
          <p><strong>Category:</strong> {food.category}</p>
          <p><strong>Price:</strong> ₹{food.price}</p>
          {food.description && <p>{food.description}</p>}
        </div>
      ))}
    </div>
  );
}

export default Menu;