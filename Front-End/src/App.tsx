import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Components/UserComponents/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

const App: React.FC = () => {
  const location = useLocation();

  const isSignInPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signup";
  const isAdminSignInPage = location.pathname === "/admin-login";
  const isForgotPasswordPage = location.pathname === "/forgot-password";
  const isResetPasswordPage = /^\/reset-password\/.+$/.test(location.pathname);

  const isOtpPage = location.pathname === "/verifyotp";

  if (isSignInPage || isSignUpPage || isOtpPage || isForgotPasswordPage 
         || isResetPasswordPage || isAdminSignInPage ) {
    return (
      <>
        <ToastContainer />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Header />
      <ToastContainer />
      <Outlet />
    </>
  );
};

export default App;
