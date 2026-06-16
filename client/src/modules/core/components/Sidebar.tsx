import { Link } from "react-router";

export function Sidebar() {
  return (
    <aside style={{ width: 250, borderRight: "1px solid #ccc", padding: "1rem" }}>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "0.5rem" }}>
            <Link to="/">Home</Link>
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <Link to="/settings">Settings</Link>
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <Link to="/calendar/create-category">Create Category</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
