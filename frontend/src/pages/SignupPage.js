import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SectionHeader from "../components/SectionHeader";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export default function SignupPage({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/users/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const loginResult = await onLogin({ email: email.trim(), password });
      if (loginResult.success) {
        navigate("/account");
        return;
      }

      setError(loginResult.message || "Registration succeeded but login failed. Please sign in.");
    } catch (registerError) {
      setError(
        registerError?.response?.data?.message ||
          registerError?.message ||
          "Unable to create an account right now."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-page">
      <SectionHeader title="Create account" subtitle="Register as a new customer to track orders, save wishlist items, and manage your profile." />
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          <span>Name</span>
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required />
        </label>
        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email" required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" required />
        </label>
        <label>
          <span>Confirm password</span>
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat password" required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary-button submit-button" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
        <p className="form-note">
          Already registered? <button type="button" className="secondary-button" onClick={() => navigate("/login")}>Sign in</button>
        </p>
      </form>
    </section>
  );
}
