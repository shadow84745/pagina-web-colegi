// components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, userRole } = useContext(AuthContext);

  if (!currentUser || (roles && !roles.includes(userRole))) {
    // Si no hay usuario o el rol del usuario no está en la lista de roles permitidos, redirige
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
