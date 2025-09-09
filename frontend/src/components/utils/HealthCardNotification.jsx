import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';

const HealthCardNotification = ({ type = "info", onClose }) => {
  const navigate = useNavigate();

  const handleGoToRegistration = () => {
    navigate('/aadhaar-registration');
  };

  if (type === "warning") {
    return (
      <div className="fixed top-4 right-4 z-50 bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <FaExclamationTriangle className="text-amber-600 text-xl mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-amber-800 mb-2">Health Card Required</h4>
            <p className="text-sm text-amber-700 mb-3">
              Complete your Aadhaar-based health card registration to access all features.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleGoToRegistration}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <FaQrcode className="text-xs" />
                <span>Register Now</span>
                <FaArrowRight className="text-xs" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-amber-600 hover:text-amber-800 text-sm font-medium transition-colors duration-200"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "success") {
    return (
      <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <FaQrcode className="text-green-600 text-xl mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-green-800 mb-2">Health Card Verified!</h4>
            <p className="text-sm text-green-700 mb-3">
              Your health card is now active. You have access to all healthcare features.
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors duration-200"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default info notification
  return (
    <div className="fixed top-4 right-4 z-50 bg-teal-50 border border-teal-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start space-x-3">
        <FaQrcode className="text-teal-600 text-xl mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-teal-800 mb-2">Health Card Status</h4>
          <p className="text-sm text-teal-700 mb-3">
            Your health card serves as your entry pass to all healthcare services.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleGoToRegistration}
              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <FaQrcode className="text-xs" />
              <span>Learn More</span>
              <FaArrowRight className="text-xs" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors duration-200"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCardNotification;
