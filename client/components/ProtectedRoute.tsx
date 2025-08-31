import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowGuest?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = false,
  allowGuest = true,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const needsLogin = (requireAuth && !user) || (!allowGuest && user?.authProvider === "guest");
    if (needsLogin) {
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [isLoading, user, requireAuth, allowGuest, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const needsLogin = (requireAuth && !user) || (!allowGuest && user?.authProvider === "guest");
  if (needsLogin) {
    return null;
  }

  return <>{children}</>;
}
