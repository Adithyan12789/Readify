import React from 'react';

interface OtpModalProps {
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  timeLeft: number;
  handleOtpSubmit: () => void;
  handleOtpResend: () => void;
  isVerifying: boolean;
  isResending: boolean;
}

const OtpModal: React.FC<OtpModalProps> = ({
  otp,
  setOtp,
  timeLeft,
  handleOtpSubmit,
  handleOtpResend,
  isVerifying,
  isResending
}) => {
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600 bg-opacity-70">
      <div className="w-full max-w-md p-10 transition-all duration-500 transform scale-105 bg-white shadow-2xl rounded-2xl hover:scale-100">
        <h3 className="mb-4 text-3xl font-bold text-center text-transparent text-gradient bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">
          OTP Verification
        </h3>
        <p className="mb-6 text-lg text-center text-gray-600">
          We have sent an OTP to your email. Please enter the OTP below to proceed with the verification.
        </p>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="w-4/5 px-6 py-4 text-2xl text-center placeholder-transparent transition-all duration-300 bg-gray-100 border-2 border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleOtpSubmit}
            disabled={isVerifying || timeLeft < 0}
            className="w-full px-4 py-3 text-white transition duration-200 bg-indigo-600 shadow-md rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 disabled:bg-indigo-400"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
          {timeLeft <= 0 && (
            <button
              onClick={handleOtpResend}
              disabled={isResending}
              className="w-full px-4 py-3 text-indigo-600 transition duration-200 bg-gray-100 shadow-md rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-300"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          )}
          <p className="text-sm text-center text-gray-600">
            Time Left: <span className="font-semibold text-indigo-600">{formatTimeLeft()}</span>
          </p>
        </div>
        <p className="mt-4 text-sm text-center text-gray-500">
          Didn't receive the OTP? Wait until the time expires to resend.
        </p>
      </div>
    </div>
  );
};

export default OtpModal;
