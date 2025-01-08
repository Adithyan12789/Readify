import { Route } from 'react-router-dom';
import HomePage from '../Pages/UserPages/HomePage';
import React from 'react';
import LoginPage from '../Pages/UserPages/LoginPage';
import RegisterPage from '../Pages/UserPages/RegisterPage';
import ForgotPassword from '../Pages/UserPages/ForgetPasswordPage';
import ResetPassword from '../Pages/UserPages/ResetPasswordPage';
import UserProfilePage from '../Pages/UserPages/UserProfilePage';
import PrivateRoute from '../Components/UserComponents/PrivateRoute';

export const UserRoutes = (
  <>
    <Route index element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<RegisterPage />} />
    <Route path="/verifyotp" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />

    <Route path="" element={<PrivateRoute />}>
      <Route path="/profile" element={<UserProfilePage />} />
    </Route>
  </>
);  
