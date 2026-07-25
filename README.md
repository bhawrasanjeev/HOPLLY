# HOPLLY

HOPLLY is an AI-first hyperlocal help platform that connects people who need assistance with nearby community helpers in real time.

## What it does

- Post help requests for everyday or urgent needs
- Browse nearby tasks and accept them
- Use an AI assistant to draft task details and estimate pricing
- Track alerts, task status, and community activity

## Tech stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express.js
- Database: MongoDB Atlas via Mongoose
- Authentication: JWT + bcryptjs
- AI: Google Gemini via the official Gen AI SDK

## Project structure

```text
client/   # React frontend
server/   # Express backend
```

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance or Atlas connection
- Gemini API key

### 1. Clone the repo

```bash
git clone https://github.com/bhawrasanjeev/HOPLLY.git
cd HOPLLY
```

### 2. Configure environment variables

Backend environment file: `server/.env`

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hoplly
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Frontend environment file: `client/.env`

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install dependencies

```bash
cd server && npm install && npm run seed
cd ../client && npm install
```

### 4. Run the app

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

The backend will typically run at `http://localhost:5000` and the client at `http://localhost:3000`.

## API highlights

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `POST /api/assistant/chat`
- `GET /api/health`

## Build check

```bash
cd client && npm run build
cd ../server && node --check server.js
```

## License

MIT
