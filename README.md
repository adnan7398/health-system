# Health System

A comprehensive health management system that combines machine learning for medical diagnosis with a modern web application interface.

## Project Overview

This project consists of three main components:
1. Frontend (React/Vite)
2. HTTP Backend (Node.js/Express)
3. ML Model Backend (Python/Flask)

## Features

- **Pneumonia Detection**: Uses VGG19-based deep learning model to detect pneumonia from chest X-ray images
- **User Authentication**: Secure login and registration system
- **Doctor Management**: System for managing doctor profiles and appointments
- **File Management**: Secure handling of medical images and documents
- **Modern UI**: Responsive and user-friendly interface

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

### HTTP Backend
- Node.js
- Express.js
- MongoDB
- Passport.js (Authentication)
- CORS

### ML Model Backend
- Python
- Flask
- TensorFlow
- VGG19
- OpenCV
- NumPy

## Project Structure

```
health-system/
├── frontend/           # React frontend application
├── http-backend/       # Node.js backend for user management
└── mlmodel-backend/    # Python backend for ML predictions
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- MongoDB
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### HTTP Backend Setup
```bash
cd http-backend
npm install
# Create .env file with required environment variables
npm start
```

### ML Model Backend Setup
```bash
cd mlmodel-backend
pip install -r requirements.txt
python app.py
```

## Environment Variables

### HTTP Backend (.env)
```
MONGO_URL=your_mongodb_connection_string
PORT=3000
```

## API Endpoints

### ML Model Backend
- POST `/pneumoniapredict` - Upload and analyze chest X-ray images

### HTTP Backend
- `/auth/*` - Authentication routes
- `/doctor/*` - Doctor management routes
- `/files/*` - File management routes

## Deployment

The application is configured for deployment on Vercel. Each component can be deployed independently:
- Frontend: Vercel
- HTTP Backend: Vercel
- ML Model Backend: Python hosting service

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- VGG19 model for image classification
- TensorFlow and Keras for deep learning
- MongoDB for database management
- React and Node.js communities for their excellent tools and documentation
