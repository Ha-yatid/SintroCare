// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import DoctorSignupForm from './DoctorSignupForm';
import PatientSignupForm from './PatientSignupForm';
import LoginForm from './LoginForm';
// import GoogleAuthButton from './GoogleAuthButton';

const AuthForm = () => {
  const [accountType, setAccountType] = useState('doctor'); // 'doctor' or 'patient'
  const [isLogin, setIsLogin] = useState(true); // true = login, false = signup

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-8 space-y-6">
        {/* Choisir le type de compte */}
        <h2 className="text-center text-xl font-bold text-gray-700">Choose Account Type</h2>
        <div className="flex justify-center space-x-8 mb-6">
          <div
            onClick={() => handleAccountTypeChange('doctor')}
            className={`flex flex-col items-center p-4 cursor-pointer ${accountType === 'doctor' ? 'border-blue-500 border-2' : 'border-gray-300 border'}`}
          >
            <img src="/doctor-icon.png" alt="Doctor" className="h-16 mb-2" />
            <span className={`${accountType === 'doctor' ? 'text-blue-500' : 'text-gray-500'}`}>Doctor</span>
          </div>
          <div
            onClick={() => handleAccountTypeChange('patient')}
            className={`flex flex-col items-center p-4 cursor-pointer ${accountType === 'patient' ? 'border-blue-500 border-2' : 'border-gray-300 border'}`}
          >
            <img src="/patient-icon.png" alt="Patient" className="h-16 mb-2" />
            <span className={`${accountType === 'patient' ? 'text-blue-500' : 'text-gray-500'}`}>Patient</span>
          </div>
        </div>

        <p className="text-center text-gray-700">Hello {accountType === 'doctor' ? 'Doctor' : 'Patient'}!</p>
        <p className="text-center text-sm text-gray-500">Please fill out the form below to get started</p>

        {/* Formulaire de connexion ou d'inscription */}
        {isLogin ? (
          <LoginForm accountType={accountType} />
        ) : accountType === 'doctor' ? (
          <DoctorSignupForm />
        ) : (
          <PatientSignupForm />
        )}
       {/* <GoogleAuthButton />*/}

        {/* Basculer entre Connexion et Inscription */}
        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleAuthMode} className="text-blue-500 hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
