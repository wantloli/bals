
// this component is used to protect public routes
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return !currentUser ? children : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
