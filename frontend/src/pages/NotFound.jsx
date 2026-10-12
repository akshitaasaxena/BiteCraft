import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main style={{ padding: "32px", textAlign: "center" }}>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/menu">Go to Menu</Link>
    </main>
  );
}

export default NotFound;
