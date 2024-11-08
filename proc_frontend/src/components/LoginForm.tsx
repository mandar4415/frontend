import React, { useState } from 'react';

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-blue-200">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg sm:p-10"
           style={{ width: '100%', maxWidth: '24rem', minHeight: '28rem' }}>
        <h2 className="text-3xl font-semibold text-center">Login</h2>
        <p className="text-center text-gray-500">Log in to continue</p>
        <form className="flex flex-col w-full space-y-4">
          <label className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600">Email</span>
            <input type="email" className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" placeholder="Email" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600">Password</span>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Password"
              />
              <span
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-4 flex items-center text-sm text-blue-500 cursor-pointer"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </span>
            </div>
          </label>
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
            Log In
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="#" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
