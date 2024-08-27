import React from 'react';
import {  Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element, ...rest }) => {
  const { currentUser } = useAuth();
  return (
    
      currentUser ? element : <Navigate to="/login" /> // if user is not login then redirect to login page
    
  );
};

export default ProtectedRoute;
