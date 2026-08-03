import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, merchantOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (merchantOnly && user.role !== 'merchant') return <Navigate to="/home" replace />;

  return children;
};

export default ProtectedRoute;
