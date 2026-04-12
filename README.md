
# AccelEstate

A full-stack application for analyzing and discovering digital assets from email data.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Radix UI components
- Recharts for data visualization
- Tailwind CSS for styling

### Backend
- Node.js with Express
- TypeScript
- CORS enabled for local development

## Project Structure

```
enron_scanner_app/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
├── backend/           # Node.js/Express API server
│   ├── src/
│   │   └── index.ts
│   └── package.json
└── package.json       # Root-level orchestration
```

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install all dependencies:
```bash
npm run install:all
```

Or install manually:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Development

Start both frontend and backend servers simultaneously:
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3002

### Individual Scripts

```bash
npm run dev:frontend    # Start only frontend
npm run dev:backend     # Start only backend
npm run build          # Build both projects
```

## Environment

- Frontend runs on port **5173** (Vite default)
- Backend API runs on port **3002**
- Backend API health check: http://localhost:3002/api/health

### Local Environment Files

This repo uses local env files that are not shared in this repo.

1. Create backend env file:
```bash
cp backend/.env.example backend/.env
```
2. Create frontend env file:
```bash
cp frontend/.env.example frontend/.env
```
3. Fill in `backend/.env` values:
	- `MONGODB_URI`: your MongoDB Atlas or local Mongo URI
	- `JWT_SECRET`: a long random secret string
	- `PORT`: defaults to `3002`


## Features

- Dashboard with asset overview
- Document management and discovery
- Asset scanning and analysis
- Action items tracking
- Settings configuration

## License

Private - Lexshift E-Accelerator Project
  
