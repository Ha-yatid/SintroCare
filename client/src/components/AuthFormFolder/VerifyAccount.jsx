/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
 
import React, { useState } from 'react';
import { verifyCode } from '../../services/userService';
import LoginForm from './LoginForm';

const VerifyAccount = ({ email, accountType }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    try { 
      const response = await verifyCode({ email, code, accountType });
      setIsVerified(true);
      setMessage('Account verified successfully!');
      
      <LoginForm accountType={accountType} />
      
    } catch (error) {
      setMessage('Invalid code. Please try again.',email,code);
    }
  };

  return (
    <div>
      {isVerified ? ( // Conditional rendering based on verification status
        <LoginForm accountType={accountType} />
    ) : (
    <form onSubmit={handleVerify} className="space-y-4">
      <h2>Enter your verification code</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Verification Code"
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Verify Account
      </button>
      {message && <p>{message}</p>}
    </form>
  )}
  </div>
);
};

export default VerifyAccount;
