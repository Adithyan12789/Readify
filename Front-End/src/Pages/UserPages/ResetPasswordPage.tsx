import { useEffect, useState } from 'react';
import { useResetPasswordMutation } from '../../Slices/UserApiSlice';
import { toast } from 'react-toastify';
import Loader from "../../Components/UserComponents/Loader";
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    document.title = "Reset Password - Ticket Hive";
  }, []);

  const submitHandler = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8 ||
        !/[a-zA-Z]/.test(password) ||
        !/\d/.test(password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error('Password must contain at least one letter, one number, one special character and must be at least 8 characters.');
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'data' in err) {
        const error = err as { data?: { message?: string } };
        toast.error(error.data?.message || 'An error occurred');
      } else {
        toast.error('An error occurred');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isLoading && <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-600 bg-opacity-50"><Loader /></div>}
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-8 text-3xl font-semibold text-center text-gray-800">
          Reset Your Password
        </h1>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 left-3" />
              <input
                className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <FontAwesomeIcon icon={faUnlockAlt} className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 left-3" />
              <input
                className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="w-full py-3 font-semibold text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
