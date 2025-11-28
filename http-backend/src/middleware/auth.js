const { verify } = require('../utils/jwt');

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }
  
  const token = authHeader.split(' ')[1];

  try {
    // if you need doctor vs user, pass 'doctor' as second arg accordingly
    const decoded = verify(token /*, 'user' or 'doctor' if needed */);
    req.user = decoded;
    return next();
  } catch (err) {
    // differentiate invalid signature vs expired etc.
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      // covers invalid signature, malformed token, etc.
      return res.status(401).json({ message: 'Invalid token signature' });
    }
    // fallback
    return res.status(401).json({ message: 'Unauthorized' });
  }
};