
# AccelEstate

Full-stack application for discovering likely digital assets from mailbox exports. The system parses MBOX-style email data, extracts sender/recipient domains, detects financial/account signals, and surfaces ranked account leads in the UI.

## Repository Status

This README is the primary handoff and operating document for engineering, demo, and partner transfer.

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Radix UI component primitives
- Recharts visualizations
- Tailwind-based styling

### Backend
- Node.js + Express
- TypeScript (ESM)
- MongoDB + Mongoose
- Multer for upload handling
- JWT auth

## Project Layout

```text
enron_scanner_app/
├── frontend/                 # React app
│   ├── src/components/       # UI flows/pages/components
│   ├── src/services/scanAPI.ts
│   └── src/hooks/useEmailScan.ts
├── backend/                  # Express API
│   ├── src/index.ts
│   ├── src/routes/           # auth, user, scan
│   ├── src/services/         # mbox parsing + signal detection
│   ├── src/models/           # MongoDB schemas
│   └── src/db/connection.ts
└── package.json              # top-level scripts
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm
- MongoDB (local or hosted)

### 1) Install

```bash
npm run install:all
```

### 2) Configure Environment

Backend environment variables (required in most setups):
- `MONGODB_URI`: Mongo connection string
- `JWT_SECRET`: secret for signing auth tokens
- `PORT`: backend port (default 3002)

Frontend environment variables:
- `VITE_API_URL`: API base URL (default `http://localhost:3002`)

### 3) Run Development Mode

```bash
npm run dev
```

Default local URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:3002
- Health check: http://localhost:3002/api/health

## Scripts

Root:
- `npm run dev`: run frontend + backend concurrently
- `npm run dev:frontend`: run only frontend
- `npm run dev:backend`: run only backend
- `npm run build`: build both projects

Backend:
- `npm run dev`: nodemon + tsx
- `npm run build`: TypeScript compile
- `npm run start`: run compiled server

Frontend:
- `npm run dev`: Vite dev server
- `npm run build`: production bundle

## System Flow

1. User signs up or logs in.
2. User uploads MBOX-like file to `POST /api/scan/upload`.
3. Backend parses mailbox messages, extracts domains, and normalizes to base domains.
4. Signal detector applies subject-based signal rules and scores each message.
5. Results are aggregated by domain and returned to the frontend.
6. User can persist scan summary/history under authenticated routes.

## API Reference

### Health
- `GET /api/health`: backend service status
- `GET /api/scan/health`: scan service status

### Authentication
- `POST /api/auth/register`
	- Body: `name`, `email`, `password`
	- Returns: JWT and user profile basics
- `POST /api/auth/login`
	- Body: `email`, `password`
	- Returns: JWT and user profile basics

### User (JWT Required)
- `GET /api/user/me`: current profile
- `POST /api/user/onboarding`: save onboarding payload
- `POST /api/user/scans`: persist summarized scan
- `GET /api/user/scans`: list scan history (without full accounts payload)
- `GET /api/user/scans/:id`: fetch full single scan

### Scan Upload
- `POST /api/scan/upload`
	- Form field: `file`
	- Supported file types: `.mbox`, `.txt`, `.eml`
	- Max size: 5 GB
	- Returns:
		- `total_messages`
		- `total_evidence_rows`
		- `total_domains`
		- `accounts[]` (ranked aggregated domain leads)

## Detection and Scoring Notes

Current signal families detected from subject text:
- Auth/security
- Billing/finance
- Subscription lifecycle
- Loyalty/rewards
- Hosting/cloud/domain operations

Score weights are currently additive:
- Auth/security: 5
- Billing/finance: 4
- Subscription: 3
- Loyalty/rewards: 2
- Hosting/cloud: 2

Higher score + higher message count leads to higher rank.

## Data Handling and Limitations

- Uploads are written to temp storage during processing and deleted after completion/error path.
- `accounts` payload is stored in Mongo for persisted scans.
- Parsing and signal detection are heuristic and can produce false positives/false negatives.
- Domain normalization uses a static multi-suffix list and is not a full public suffix implementation.
- Current auth defaults include fallback secrets in code for local dev convenience; production should always set strong environment secrets.

## Troubleshooting

- Backend fails to start:
	- Verify MongoDB is reachable via `MONGODB_URI`.
	- Confirm backend dependencies are installed.
- Login/register fails with 500:
	- Check Mongo connection and write permissions.
- Upload fails:
	- Confirm form field name is `file`.
	- Validate extension and size limits.
	- Ensure backend is reachable from frontend `VITE_API_URL`.

## Team Handoff Checklist

- Source code pushed and accessible to all teammates and project partner.
- Environment variables documented and shared through secure channel.
- MongoDB instance details documented (host, DB name, access method).
- Demo path documented (register -> upload -> view results -> save scan).
- Known limitations and next steps recorded in guidelines.

## License

Private project for Lexshift E-Accelerator coursework/team use.
  
