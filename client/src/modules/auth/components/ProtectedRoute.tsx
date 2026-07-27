import { Navigate } from "react-router";
import { useAuth } from "../../../lib/hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useAuth();

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
