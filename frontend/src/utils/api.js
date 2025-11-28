// API Configuration Utility
// Automatically detects if running on localhost or production

const getApiBase = () => {
  // Check if VITE_API_BASE is explicitly set in environment
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }

  // Auto-detect based on current hostname
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // If running on localhost or 127.0.0.1, use local backend
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
    return 'http://localhost:3000';
  }

  // Otherwise, use production URL
  return 'https://arogyam-15io.onrender.com';
};

const getMLApiBase = () => {
  // Check if VITE_ML_API_BASE is explicitly set
  if (import.meta.env.VITE_ML_API_BASE) {
    return import.meta.env.VITE_ML_API_BASE;
  }

  // Auto-detect based on current hostname
  const hostname = window.location.hostname;

  // If running on localhost, use local ML backend
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
    return 'http://127.0.0.1:5001';
  }

  // Otherwise, use production ML backend URL (if you have one)
  return import.meta.env.VITE_ML_API_BASE || 'http://127.0.0.1:5001';
};

export const API_BASE = getApiBase();
export const ML_API_BASE = getMLApiBase();

// Export function for dynamic usage
export { getApiBase, getMLApiBase };

