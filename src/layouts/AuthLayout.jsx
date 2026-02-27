import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-6 sm:px-6">
            <div className="flex justify-center">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ST</span>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">SanTrack</h1>
                  <p className="text-sm text-gray-500">Rural Sanitation System</p>
                </div>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
