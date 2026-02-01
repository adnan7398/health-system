## Health System – High-Level System Design

This document explains the overall system design of the **Health System** in this repo so you can confidently describe it in a system-design interview (e.g., at Juspay).

It is written to match the actual codebase structure:
- `frontend/` – React/Vite SPA
- `http-backend/` – Node.js + Express + MongoDB API
- `mlmodel-backend/` – Python + Flask ML service

---

## 1. Problem Statement & Requirements

### 1.1 What problem we are solving
- Provide a **digital health platform** where:
  - Patients can register/login, upload medical artifacts (reports, X-rays, PDFs), view predictions/summaries, and book appointments.
  - Doctors can manage their profiles, see patient reports and ML outputs, and manage appointments.
  - ML models assist with **pneumonia, heart disease, breast cancer, PCOD** prediction and **text summarization / remedies search**.

### 1.2 Functional requirements
- **User management & auth**
  - Registration & login for patients and doctors.
  - Role-based access (patient vs doctor).
  - Session management using JWT.
- **Medical artifact management**
  - Upload images (X-rays, lab reports, etc.) and documents.
  - Store metadata, track ownership, and allow secure access.
- **ML-based diagnostics**
  - Pneumonia detection from chest X-rays.
  - Heart disease, breast cancer, PCOD risk prediction from structured inputs/reports.
  - Lab report summarization and “desi remedies” semantic search.
- **Doctor & appointment management**
  - CRUD for doctor profiles.
  - Patients can view doctors, book/cancel appointments.
  - Doctors can view their appointments and patient data.

### 1.3 Non-functional requirements
- **Security & privacy**: Protect PII/PHI, encrypt at rest and in transit, strict access control.
- **Scalability**: Support growth in users, uploads, and ML requests.
- **Availability & reliability**: No single point of failure; graceful degradation if ML is down.
- **Performance**: Reasonable latency (sub‑300 ms for most API calls; ML calls tuned depending on model).
- **Observability**: Logging, metrics, tracing, and alerts.

---

## 2. High-Level Architecture

At a high level, the system is split into three logical tiers.

- **Client (Web Frontend) – `frontend/`**
  - React single-page app (Vite) with routing, i18n, and dashboards.
  - Communicates with `http-backend` via REST APIs.
  - Handles auth UI, file upload UI, ML results presentation, and appointment management screens.

- **Core API Backend – `http-backend/`**
  - Node.js + Express app.
  - Owns:
    - Authentication (Passport.js, JWT).
    - Users & doctors (MongoDB schemas).
    - Appointments.
    - File metadata and secure file handling.
    - Integration layer that calls the ML backend.

- **ML Model Backend – `mlmodel-backend/`**
  - Python + Flask application.
  - Hosts multiple ML models:
    - `breast_cancer_model.pkl` + scaler.
    - `heart_disease_model.pkl` + scaler.
    - `pcod_model.pkl` + scaler.
    - Pneumonia detection model (CNN, likely VGG‑based) for X-rays.
    - Lab report analyzer & semantic search (using `semantic_search.py`, FAISS index, embeddings).
  - Exposes HTTP endpoints for prediction.

You can describe it to an interviewer as a **microservice-style architecture** with:
- A **web client**, a **business API service**, and a separate **ML inference service**.

---

## 3. Component Responsibilities

### 3.1 Frontend (`frontend/`)
- **Tech**: React, Vite, React Router, Axios, i18n (multiple locales), CSS/Tailwind.
- **Responsibilities**:
  - Authentication flows (login/doctor login).
  - Rendering **patient dashboard** (appointments, reports, health cards, ML insights).
  - Rendering **doctor dashboard** (patients, appointments, ML reports).
  - File upload UX (reports, X-rays, etc.).
  - Triggering ML flows (calling prediction endpoints via the API).
  - Internationalization (i18n JSON files in `src/i18n/locales`).

### 3.2 HTTP Backend (`http-backend/`)
- **Tech**: Node.js, Express, MongoDB, Passport.js, JWT, middleware for auth and file upload.
- **Main Folders**:
  - `src/models/` – `userschema.js`, `file.js`, `db.js` connection.
  - `src/routes/` – `user.js`, `doctor.js`, `booking.js`, `appoinment.js`, `fileRoute.js`.
  - `src/middleware/` – `auth.js`, `doctor.js`, `user.js`, `upload.js`.
  - `src/utils/` – `db.js`, `jwt.js`.
- **Responsibilities**:
  - **User & doctor auth**:
    - Register/login, issue JWT tokens.
    - Use Passport strategies & custom middleware to protect routes.
  - **Role-based APIs**:
    - Patient routes: profile, appointments, uploads.
    - Doctor routes: profile, schedule, patient access.
  - **Appointments**:
    - Endpoints to create, update, cancel bookings.
    - Conflict prevention on timeslots.
  - **File management**:
    - Handle uploads (currently local `uploads/` in repo; in production: move to S3/GCS).
    - Save metadata in MongoDB (`file.js`).
    - Optionally interact with ML backend using uploaded files.
  - **Integration with ML backend**:
    - Call Python service’s endpoints for predictions based on files or form inputs.

### 3.3 ML Model Backend (`mlmodel-backend/`)
- **Tech**: Python, Flask, TensorFlow/Keras, scikit-learn, FAISS, NumPy, etc. (see `requirements.txt`).
- **Main Files**:
  - `app.py` – main Flask app exposing HTTP APIs.
  - `train_models.py` – training scripts.
  - `semantic_search.py` and `desi_remedies_dataset.json` – semantic remedies search.
  - `lab_report_analyzer.py` – lab report analysis & summarization.
  - `models/` – pre-trained model & scaler `.pkl` files + FAISS index.
- **Responsibilities**:
  - Provide **prediction endpoints** for:
    - Heart disease, breast cancer, PCOD risk.
    - Pneumonia detection from images.
    - Text summarization / semantic search for remedies.
  - Load and manage ML models in memory.
  - Preprocess inputs (images, numeric features, text) and return structured JSON with predictions and probabilities.

---

## 4. Data Model (Logical View)

In MongoDB, you can imagine the following collections (some already present, some implicit):

- **`users`**
  - `email`, `password_hash`, `role` (patient/doctor_admin), profile info, timestamps.
- **`doctors`**
  - Linked to `users` by `user_id`.
  - `specialization`, `experience`, `schedule`, etc.
- **`appointments`**
  - `user_id`, `doctor_id`, `start_time`, `end_time`, `status` (booked/cancelled/completed).
  - `notes`, `created_at`, `updated_at`.
- **`files`**
  - `owner_user_id`, optional `doctor_id`, `file_path` or `storage_key`, `mime_type`, `size`, `created_at`.
- **`ml_results`** (can be stored in same DB)
  - `file_id` or `input_id`, `model_name`, `model_version`, `prediction`, `score`, `created_at`.

In interviews, emphasize:
- **Indexes** on:
  - `users.email` (unique).
  - `appointments` on `(doctor_id, start_time)` and `(user_id, start_time)`.
  - `files.owner_user_id`.

---

## 5. Core Flows (Sequence-Level Thinking)

### 5.1 Authentication Flow
1. User submits login credentials from frontend.
2. `http-backend`:
   - Validates credentials against MongoDB.
   - If valid, issues a JWT with user id + role.
3. Frontend stores JWT (e.g., in memory or secure storage) and includes it in `Authorization: Bearer` headers.
4. Protected routes in backend check JWT via `auth` middleware and enforce role-based access (`user.js`, `doctor.js` middlewares).

You can mention **access token + (optionally) refresh token** patterns in an interview, even if code currently only uses access tokens.

### 5.2 File Upload & ML Prediction (simplified)
1. Patient logs in and uploads a medical artifact from frontend.
2. Frontend sends file to `http-backend` (multipart/form-data).
3. `http-backend`:
   - Uses `upload.js` middleware to store file (current implementation: local `uploads/` folder).
   - Saves metadata in MongoDB (`file.js` model).
4. To run ML:
   - Either `http-backend` calls `mlmodel-backend` with the file path / binary.
   - ML backend loads appropriate model, runs prediction, and returns result JSON.
   - HTTP backend stores the result in DB and returns it to the frontend.
5. Frontend displays predictions/summary on the dashboard.

In **production design**, you would say:
- Replace local file system with **object storage** (e.g., S3/GCS).
- Use **presigned URLs** for upload/download, and store only metadata + keys in MongoDB.

### 5.3 Appointment Booking
1. Patient selects a doctor and desired time slot.
2. Frontend POSTs to `http-backend` appointment route.
3. Backend:
   - Validates time slot (no conflict with existing appointments).
   - Creates appointment document in MongoDB.
4. Doctor’s dashboard fetches appointments via protected doctor routes.

You can add in interview:
- Use **idempotency keys** to avoid double booking on client retries.
- Add asymmetric views: patients see only their appointments, doctors see all for them.

---

## 6. Non-Functional Design

### 6.1 Scalability
- **Horizontal scaling** of:
  - `http-backend` – stateless API instances behind a load balancer.
  - `mlmodel-backend` – separate deployment, autoscaled based on CPU usage or queue length.
- Database:
  - Use **MongoDB Atlas** or managed Mongo with replica sets.
  - Proper indexes to keep queries fast.
- Static assets:
  - Deploy frontend on a **CDN** (e.g., Vercel).

### 6.2 Reliability & Fault Tolerance
- Health checks for both `http-backend` and `mlmodel-backend`.
- Retries with **exponential backoff** when `http-backend` calls ML backend.
- Circuit breaker patterns to avoid cascading failures if ML is down.
- Backups and **point‑in‑time recovery** on MongoDB.

### 6.3 Security & Privacy
- HTTPS everywhere.
- JWT-based authentication and **role-based authorization**.
- Input validation and sanitation on all external inputs.
- Protection of sensitive data:
  - Encrypt data at rest (DB + storage).
  - Avoid storing raw PHI in logs; use structured logs with identifiers instead.
  - Limit who can access which records (only patient + assigned doctors).

### 6.4 Observability
- **Logs**:
  - Structured logging from both Node and Flask.
  - Include `request_id`, `user_id`, and route info.
- **Metrics**:
  - Requests per second, error rates, p95 latency per endpoint.
  - ML-specific: model inference latency, failure rate, queue length (if you introduce async jobs).
- **Tracing**:
  - Propagate a request ID from frontend → http-backend → mlmodel-backend to debug end‑to‑end flows.

---

## 7. Deployment View

- **Frontend**
  - Built with Vite and deployed as static assets.
  - Hosted on Vercel or S3+CloudFront; talks to API via environment-configured base URL.

- **HTTP Backend**
  - Node app packaged as a container or deployed on a platform (e.g., Vercel Functions, AWS ECS, Kubernetes).
  - Environment variables (`MONGO_URL`, `JWT_SECRET`, etc.) configured via secrets manager.

- **ML Backend**
  - Flask app packaged as a container, with heavier CPU/GPU requirements possible.
  - Deployed separately from the main API to scale independently.

- **Data Stores**
  - MongoDB Atlas (replica set, backups).
  - Object storage (for a production-ready version) for all uploads.

---

## 8. How to Explain This in an Interview (Script)

You can summarize the system like this:

- **One-liner**:  
  “This is a health platform where patients upload medical reports and images, and doctors view ML-assisted diagnostics and manage appointments.”

- **Architecture summary**:  
  “The frontend is a React SPA on a CDN. It talks to a Node/Express API that handles auth, users, doctors, appointments, and file metadata stored in MongoDB. For heavy ML workloads, the Node API calls a separate Python/Flask service that hosts multiple trained models for pneumonia, heart disease, breast cancer, PCOD, and text summarization. Files are uploaded, stored, and then passed to the ML service for inference, and the results are stored back in Mongo for later retrieval.”

- **Key design points you should mention**:
  - Separation of concerns: UI vs business API vs ML inference.
  - Role-based access control (patient vs doctor).
  - Using MongoDB for flexible health data schemas, with indexes for performance.
  - Using object storage (conceptually) for large binary files and presigned URLs.
  - Security around PHI/PII: JWT, TLS, least‑privilege access to DB and storage, no sensitive data in logs.
  - Scalability: independent scaling of API and ML services, stateless APIs, managed DB, CDN for static assets.
  - Reliability: health checks, retries, circuit breakers, backups.
  - Observability: structured logs, metrics, traces.

- **If they go deeper**:
  - Talk about **async ML**: for very heavy models, you can design it as a job queue where users get a `job_id` and poll for results.
  - Mention **model versioning**: store `model_version` in `ml_results` and support canary releases of new models.
  - Mention **rate limiting** and **WAF** at the API gateway for protection.

---

## 9. Future Improvements (Good to Mention)

- Replace local file storage in `http-backend` with cloud object storage + presigned URLs.
- Add Redis for:
  - Caching frequent reads (doctors list, model outputs for identical inputs).
  - Rate limiting and session management.
- Introduce a job queue (e.g., RabbitMQ/Kafka/SQS) for long‑running ML tasks.
- Add full observability stack (Prometheus + Grafana, ELK, or cloud-native tools).
- Add strict audit logging for every access to patient records (compliance‑friendly).

You can point to this document (`SYSTEM_DESIGN.md`) during preparation and practice explaining each section out loud in 2–3 minutes. In the interview, start with **problem → architecture → data → core flows → non‑functionals → trade‑offs**. 