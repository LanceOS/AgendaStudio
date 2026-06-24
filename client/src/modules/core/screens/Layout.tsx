import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";

export function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <main className="lib-flex-1">
        <Outlet />
      </main>
    </div>
  );
}
