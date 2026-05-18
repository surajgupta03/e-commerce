import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    const result = await onLogin({ email: email.trim(), password });

    setLoading(false);
    if (result.success) {
      navigate("/account");
      return;
    }

    setError(result.message || "Unable to sign in.");
  }

  return (
    <section className="login-page">
      <SectionHeader title="Login" subtitle="Sign in to access your wishlist, orders, and account details." />
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email" required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary-button submit-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
