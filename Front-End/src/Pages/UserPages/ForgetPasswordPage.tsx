import { useEffect, useState } from 'react';
import { useSendPasswordResetEmailMutation } from '../../Slices/UserApiSlice';
import { toast } from 'react-toastify';
import Loader from "../../Components/UserComponents/Loader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [sendPasswordResetEmail, { isLoading }] = useSendPasswordResetEmailMutation();

  useEffect(() => {
    document.title = "Forgot Password - Ticket Hive";
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if (email.trim() === '') {
      toast.error('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Invalid email format');
      return;
    }

    try {
      await sendPasswordResetEmail({ email }).unwrap();
      toast.success('Password reset email sent successfully');
      setEmailSent(true); 
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600">
      {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"><Loader /></div>}
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-xl">
        <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800">
          {emailSent ? 'Check Your Email' : 'Forgot Password'}
        </h1>
        {emailSent ? (
          <p className="mb-6 text-lg text-center text-gray-600">
            We have sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions to reset your password.
          </p>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute text-gray-400 left-5 top-5" />
              <input
                className="w-full px-5 py-3 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                type="text"
                style={{paddingLeft: "20px"}}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="w-full px-4 py-3 text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              Send Reset Link
            </button>
          </form>
        )}

        {emailSent && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Didn't receive the email?{' '}
              <button
                className="text-indigo-600 hover:underline"
                onClick={() => setEmailSent(false)}
              >
                Resend
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
