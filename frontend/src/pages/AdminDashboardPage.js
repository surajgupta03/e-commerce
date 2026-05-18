import SectionHeader from "../components/SectionHeader";

export default function AdminDashboardPage({ user }) {
  const isAdmin = user?.role === "admin";

  return (
    <section className="admin-dashboard-page">
      <SectionHeader
        title={isAdmin ? "Admin Dashboard" : "Admin access required"}
        subtitle={
          isAdmin
            ? "Use this page to manage products, orders, and site settings."
            : "Please sign in with an admin account to access admin features."
        }
      />
      {isAdmin ? (
        <div className="admin-dashboard-cards">
          <article className="admin-card">
            <h3>Product management</h3>
            <p>Use backend APIs to add, edit, or remove products from the store.</p>
          </article>
          <article className="admin-card">
            <h3>Order management</h3>
            <p>Review recent orders and update order status for fulfillment.</p>
          </article>
          <article className="admin-card">
            <h3>User management</h3>
            <p>Admin accounts can view customer activity and support requests.</p>
          </article>
        </div>
      ) : (
        <div className="action-note">
          <p>Sign in with admin credentials at the login page to continue.</p>
        </div>
      )}
    </section>
  );
}
