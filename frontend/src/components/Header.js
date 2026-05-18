import { NavLink } from "react-router-dom";

export default function Header({ cartCount, loggedIn, onLogout }) {
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Cart", path: "/cart" },
    { label: loggedIn ? "Account" : "Login", path: loggedIn ? "/account" : "/login" },
    { label: "Support", path: "/support" },
  ];

  return (
    <header className="site-header">
      <NavLink className="brand" to="/">
        <span>N</span>
        <div>
          <strong>Nexa Store</strong>
          <small>Modern essentials</small>
        </div>
      </NavLink>
      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <NavLink className="cart-button" to="/cart">
          Cart <span>{cartCount}</span>
        </NavLink>
        {loggedIn && (
          <button type="button" className="ghost-button" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
