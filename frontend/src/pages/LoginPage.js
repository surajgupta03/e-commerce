import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!email || !password) return;
    onLogin({ name: name.trim() || "Shopper", email: email.trim() });
    navigate("/account");
  }

  return (
    <section className="login-page">
      <SectionHeader title="Login" subtitle="Sign in to access your wishlist, orders, and account details." />
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email" required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" required />
        </label>
        <button type="submit" className="primary-button submit-button">
          Sign in
        </button>
      </form>
    </section>
  );
}
