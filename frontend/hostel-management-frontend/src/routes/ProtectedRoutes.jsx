import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../constants/index.js';
import Spinner from '../components/common/Spinner.jsx';

// Redirects unauthenticated users to /login
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner fullScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  return children;
};

// Restricts to admin role
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner fullScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />;
  return children;
};

// Restricts to student role
export const StudentRoute = ({ children }) => {
  const { isAuthenticated, isStudent, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner fullScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  if (!isStudent) return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  return children;
};

// Redirects already-authenticated users away from login/register
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Spinner fullScreen />;
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.STUDENT_DASHBOARD} replace />;
  }
  return children;
};