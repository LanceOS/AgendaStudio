import { Navigate } from "react-router";
import { authClient } from "../../../lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f172a", color: "white" }}>
        Loading...
      </div>
    );
  }

  if (!data?.session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
