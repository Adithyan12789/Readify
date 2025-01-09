import { Route } from 'react-router-dom';
import HomePage from '../Pages/UserPages/HomePage';
import React from 'react';
import LoginPage from '../Pages/UserPages/LoginPage';
import RegisterPage from '../Pages/UserPages/RegisterPage';
import ForgotPassword from '../Pages/UserPages/ForgetPasswordPage';
import ResetPassword from '../Pages/UserPages/ResetPasswordPage';
import UserProfilePage from '../Pages/UserPages/UserProfilePage';
import PrivateRoute from '../Components/UserComponents/PrivateRoute';
import BookDetailPage from '../Pages/UserPages/BookDetailPage';
import AllBooksPage from '../Pages/UserPages/AllBooksPage';
import EditBookModal from '../Components/UserComponents/EditBook';
import { BookData } from '../Types/UserTypes';

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
      <Route path="/book/:bookId" element={<BookDetailPage />} />
      <Route path="/allBooks" element={<AllBooksPage />} />
      <Route path="/editBook/:bookId" element={<EditBookModal isOpen={false} onClose={function (): void {
        throw new Error('Function not implemented.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } } bookId={''} editBook={function (): Promise<{ data: BookData; } | { error: any; }> {
        throw new Error('Function not implemented.');
      } } />} />
    </Route>
  </>
);  
