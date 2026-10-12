import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        setPassword("");
        setSuccess("You are now signed in.");

        try {
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          if (payload.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/menu");
          }
        } catch {
          navigate("/menu");
        }
      } else {
        setError("Email or password is incorrect.");
      }
    } catch (err) {
      setError(err.message || "Unable to connect. Please try again.");
    }

    setLoading(false);
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <p className="login-brand">BiteCraft</p>
        <h1 id="login-title">Welcome back</h1>
        <p className="login-intro">Sign in to continue to your account.</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <p className="login-message login-error" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="login-message login-success" role="status">
              {success}
            </p>
          )}

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p style={{ margin: "16px 0 0", textAlign: "center", fontSize: "0.95rem" }}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
