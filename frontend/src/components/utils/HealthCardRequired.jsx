import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaExclamationTriangle, FaArrowRight, FaHeartbeat } from 'react-icons/fa';

const HealthCardRequired = () => {
  const navigate = useNavigate();

  const handleGoToRegistration = () => {
    navigate('/aadhaar-registration');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="text-4xl text-amber-600" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Health Card Required
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          You need to complete your Aadhaar-based health card registration before accessing this feature. 
          Your health card serves as your entry pass to all healthcare services.
        </p>

        {/* Benefits */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Health Card is Required?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <FaHeartbeat className="text-teal-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Secure Access</h4>
                <p className="text-sm text-gray-600">Verified identity for secure healthcare access</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaQrcode className="text-teal-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Quick Verification</h4>
                <p className="text-sm text-gray-600">Instant verification during medical visits</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaHeartbeat className="text-teal-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Health Records</h4>
                <p className="text-sm text-gray-600">Centralized health information storage</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaQrcode className="text-teal-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Emergency Access</h4>
                <p className="text-sm text-gray-600">Critical information during emergencies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoToRegistration}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
          >
            <FaQrcode className="text-xl" />
            <span>Complete Health Card Registration</span>
            <FaArrowRight className="text-lg" />
          </button>
          
          <button
            onClick={handleGoToHome}
            className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300"
          >
            Back to Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
          <p className="text-sm text-teal-800">
            <strong>Note:</strong> The registration process requires your Aadhaar number and takes only a few minutes. 
            Once completed, you'll have access to all healthcare features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthCardRequired;
