const mongoose = require('mongoose');

async function connectDB(uri, opts = {}) {
	const maxRetries = opts.retries || 5;
	const retryDelay = opts.retryDelay || 2000;
	if (!uri) throw new Error('MONGO_URL is not defined');

	mongoose.set('strictQuery', true);
	// disable command buffering so failed queries error fast
	mongoose.set('bufferCommands', false);

	const mongooseOpts = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// ...you can add more options here...
		...opts.mongooseOptions,
	};

	let attempt = 0;
	while (attempt < maxRetries) {
		try {
			await mongoose.connect(uri, mongooseOpts);
			console.log('MongoDB connected');
			return mongoose;
		} catch (err) {
			attempt += 1;
			console.error(`MongoDB connection attempt ${attempt} failed:`, err.message || err);
			if (attempt >= maxRetries) {
				throw err;
			}
			// wait before retrying
			await new Promise((r) => setTimeout(r, retryDelay));
		}
	}
}

module.exports = { connectDB };
