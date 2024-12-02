/* eslint-disable no-unused-vars */
import React from 'react';
import { Navigate } from 'react-router-dom';
//import { UserContext } from '../../context/context';


// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, role }) => {
  //const user = localStorage.getItem('user');
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('protected  ',user)
  if (!user || user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
