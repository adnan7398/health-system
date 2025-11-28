const jwt = require('jsonwebtoken');

function stripSurroundingQuotes(s) {
	// ...existing code...
	if (!s || typeof s !== 'string') return s;
	if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
		return s.slice(1, -1);
	}
	return s;
}

function getRawSecret(type = 'user') {
	// returns the raw env value (may include quotes)
	if (type === 'doctor') {
		if (!process.env.DOCTOR_JWT_SECRET) throw new Error('DOCTOR_JWT_SECRET not configured');
		return process.env.DOCTOR_JWT_SECRET;
	}
	if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not configured');
	return process.env.JWT_SECRET;
}

function getSecret(type = 'user') {
	// returns the cleaned secret (no surrounding quotes)
	const raw = getRawSecret(type);
	return stripSurroundingQuotes(raw);
}

function sign(payload, options = {}, type = 'user') {
	const secret = getSecret(type);
	// default HS256; caller can override expiresIn via options
	return jwt.sign(payload, secret, { algorithm: 'HS256', ...(options || {}) });
}

function verify(token, type = 'user') {
	const primary = getSecret(type);
	try {
		// try cleaned secret first
		return jwt.verify(token, primary, { algorithms: ['HS256'] });
	} catch (err) {
		// if signature invalid, attempt fallback to raw env secret (covers tokens signed when env included quotes)
		if (err && err.name === 'JsonWebTokenError' && err.message && err.message.toLowerCase().includes('invalid signature')) {
			const raw = getRawSecret(type);
			// if raw differs from primary, try verifying with raw
			if (raw !== primary) {
				try {
					return jwt.verify(token, raw, { algorithms: ['HS256'] });
				} catch (err2) {
					// fall through to rethrow original error for clarity
				}
			}
		}
		// rethrow original error
		throw err;
	}
}

module.exports = { sign, verify };
