import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Cart", path: "/cart" },
  { label: "Account", path: "/account" },
  { label: "Support", path: "/support" },
];

export default function Header({ cartCount }) {
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
        <NavLink className="ghost-button" to="/shop">
          Browse
        </NavLink>
        <NavLink className="cart-button" to="/cart">
          Cart <span>{cartCount}</span>
        </NavLink>
      </div>
    </header>
  );
}
