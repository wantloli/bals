// src/components/ProtectedRoute.jsx

//this component is used to protect routes that require authentication
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Optionally show a loader

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
