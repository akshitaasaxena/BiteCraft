import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/foods")
      .then(data => setFoods(data))
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Menu</h1>

      {foods.map(food => (
        <div key={food._id}>
          <h2>{food.name}</h2>
          <p>{food.category}</p>
          <p>₹{food.price}</p>
          <p>{food.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Menu;