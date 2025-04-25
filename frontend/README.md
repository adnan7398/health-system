# Health System Frontend

This is the React frontend for the Health System application.

## Deployment to Vercel

### Prerequisites
- A Vercel account
- Vercel CLI installed: `npm i -g vercel`
- Git repository set up

### Steps to Deploy

1. **Update Environment Variables**
   
   Update the `.env.production` file with your backend URL:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

2. **Update the Vercel Configuration**
   
   Make sure the `vercel.json` file has the correct backend URL:
   ```json
   {
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "https://your-backend-url.vercel.app/$1"
       },
       ...
     ]
   }
   ```

3. **Install Vercel CLI** (if not already installed)
   ```
   npm i -g vercel
   ```

4. **Login to Vercel**
   ```
   vercel login
   ```

5. **Deploy**
   From the `frontend` directory:
   ```
   vercel
   ```
   
   For production deployment:
   ```
   vercel --prod
   ```

### Important Notes
- Set up environment variables in the Vercel dashboard to match your production environment
- Make sure your backend CORS settings include your frontend Vercel URL
- After deployment, test the application to ensure the frontend can communicate with the backend 