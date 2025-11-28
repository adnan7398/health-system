
require('dotenv').config();
const express = require('express');
const app = express();
const { connectDB } = require('./utils/db');

// Middleware and routes
// ...existing middleware and routes code...

async function start() {
	try {
		if (!process.env.MONGO_URL) {
			throw new Error('MONGO_URL is not configured in .env');
		}
		await connectDB(process.env.MONGO_URL);

		// Start server only after DB connected
		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => console.log(`Server running on ${PORT}`));
	} catch (err) {
		console.error('Failed to start server:', err);
		process.exit(1);
	}
}

start();