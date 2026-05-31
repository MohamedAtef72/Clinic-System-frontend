import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import FullPageSpinner from "./FullPageSpinner";

/**
 * Protects a route behind authentication and optional role-based access.
 *
 * @param {React.ReactNode} children  - The component to render when access is granted.
 * @param {string[]}        [roles]   - Optional whitelist of allowed roles (e.g. ["Admin"]).
 *                                     When omitted any authenticated user may access the route.
 *
 * @example
 * // Admin-only route
 * <ProtectedRoute roles={["Admin"]}><DashboardPage /></ProtectedRoute>
 *
 * // Any authenticated user
 * <ProtectedRoute><ProfilePage /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Wait for the auth check to complete before deciding
  if (loading) return <FullPageSpinner />;

  // Not logged in → send to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Logged in but doesn't have the required role → send home
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;