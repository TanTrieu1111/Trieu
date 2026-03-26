import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AppContext';

/**
 * ProtectedRoute component to handle role-based access control.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized.
 * @param {string[]} props.allowedRoles - Array of roles allowed to access the route.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return null; // Or a loading spinner
  }

  if (!user) {
    // If guest is allowed, let them pass
    if (allowedRoles && allowedRoles.includes('guest')) {
      return children;
    }
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to admin panel if user is admin, otherwise to home
    const redirectPath = user.role === 'admin' ? '/admin' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
