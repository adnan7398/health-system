# Health System Backend

This is the backend server for the Health System application.

## Deployment to Vercel

### Prerequisites
- A Vercel account
- Vercel CLI installed: `npm i -g vercel`
- Git repository set up

### Steps to Deploy

1. **Install Vercel CLI** (if not already installed)
   ```
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```
   vercel login
   ```

3. **Set up environment variables in Vercel**
   You need to set up the following environment variables in your Vercel project settings:
   - MONGO_URL
   - JWT_SECRET
   - DOCTOR_JWT_SECRET
   - Google_Client_ID
   - Google_Client_Secret
   - UPLOAD_PATH

4. **Deploy**
   From the `http-backend` directory:
   ```
   vercel
   ```
   
   For production deployment:
   ```
   vercel --prod
   ```

### Important Notes
- The MongoDB connection must use a cloud-hosted MongoDB instance (like MongoDB Atlas)
- File uploads might work differently in Vercel - consider using a cloud storage solution
- Vercel deployments are serverless, so any long-running processes should be adapted 