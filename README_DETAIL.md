# AccelEstate - Absurdly Detailed Technical README

Welcome to the **AccelEstate** technical deep-dive. This application is a full-stack discovery engine and digital asset management tool designed to uncover hidden or forgotten accounts, subscriptions, and digital evidence from MBOX email archives, primarily to assist in executing estates or managing digital footprints. 

This document exhaustively details the architecture, capabilities, and inner workings of both the Frontend and Backend components.

---

## 1. High-Level Architecture

The project is structured as a monolithic repository containing two distinct uncoupled services:
* **Frontend:** A React 18 single-page application built with Vite and TypeScript. It relies on Tailwind CSS for utility-first styling and Radix UI for accessible primitives.
* **Backend:** A Node.js and Express server built with TypeScript, acting as the parsing and analysis engine for email archives.

---

## 2. Backend Deep Dive: The Discovery Engine

The backend (running by default on port `3002`) handles the heavy lifting of parsing `.mbox`, `.txt`, and `.eml` files (up to 5GB in size) and detecting signals of digital assets.

### 2.1 API Endpoints (`src/routes/scanRoutes.ts`)
- `GET /api/scan/health`: A simple health check to verify backend status.
- `POST /api/scan/upload`: The core API endpoint for data ingestion. It leverages `multer` to stream multipart-form uploads into the server's temporary directory. Once uploaded, it passes the file through the parsing pipeline, deletes the temporary file to prevent storage bloat, and returns the aggregated results to the client.

### 2.2 The MBOX Parser (`src/services/mboxParser.ts`)
The `MboxParser` class operates on streams (`createReadStream`) to handle massive files without overflowing RAM.
- **Chunking Logic:** It processes the file in 64KB chunks, buffering until it detects the standard MBOX separator (`\nFrom `) using Regular Expressions.
- **Header Parsing:** It isolates the header block and parses standard headers (`Message-ID`, `Subject`, `Date`, `From`, `To`, `Cc`, `Bcc`).
- **Domain Normalization:** It extracts root domains from email addresses in the `From` and `To` headers, intelligently ignoring tracking prefixes but preserving structured suffixes like `.co.uk` and `.com.au`.
- **Fallback Hashing:** To uniquely identify messages uniformly, it guarantees a fallback hash generated via SHA-1 based on the `From`, `To`, `Date`, and `Subject` fields.

### 2.3 The Signal Detector (`src/services/signalDetection.ts`)
Once domains are extracted, the `SignalDetector` performs regular expression matching against message subjects to categorize and "score" the evidence.
- **Categorization Flags:**
  - `auth_security`: Searches for "verification", "password reset", "otp", "2-step", "mfa", etc. (Weight +5)
  - `billing_finance`: Searches for "receipt", "invoice", "payment", "refund", "purchase", etc. (Weight +4)
  - `subscription`: Searches for "renewal", "membership", "plan", "auto-renew", etc. (Weight +3)
  - `loyalty_rewards`: Searches for "points", "miles", "tier", etc. (Weight +2)
  - `domains_hosting_cloud`: Searches for "dns", "ssl", "hosting", "storage", etc. (Weight +2)
- **Aggregation:** It groups all messages by their base domain string. It returns unique domain footprints displaying the total score, signal flags hit, message counts, first/last seen dates, and a sample of subjects.
- **Brand Mapping:** Hardcoded mapping turns raw domains (e.g., `netflix.com`) into distinct human-readable properties (`Netflix`).

---

## 3. Frontend Deep Dive: User Interface & State

The Frontend (running by default on `5173`) serves as the command center for the entire pipeline, routing users through Auth, Onboarding, and the Main App.

### 3.1 Orchestration (`src/App.tsx`)
The entry point conditionally routes users based on an internal state machine consisting of three phases:
1. `!isAuthenticated` -> **AuthFlow**
2. `isAuthenticated && !hasCompletedOnboarding` -> **OnboardingFlow**
3. `isAuthenticated && hasCompletedOnboarding` -> **Main App / Dashboard**

### 3.2 Authentication (`src/components/auth/`)
Contains `LoginScreen.tsx` and `SignupScreen.tsx`. It acts as the gateway to the application.

### 3.3 Onboarding Flow (`src/components/onboarding/`)
A guided multi-step wizard (`OnboardingFlow.tsx`) that collects essential legal and scoping information before allowing access.
- **Steps Included:** 
  1. `Welcome`: Basic welcome prompt.
  2. `AuthorityScreen`: Asks the user if they possess Letters of Office, Small Estate Certificates, and validates their legal authority level (None / Limited / Full).
  3. `EstateValueScreen`: Ascertains the estimated net worth of the estate (e.g., small estate affidavit threshold).
  4. `LegalPathwayScreen`: Asks the user to select their desired legal path (e.g., Probate, Small Estate, Unknown).
  5. `DiscoveryMethodsScreen`: Collects user preferences on whether automated discovery is allowed (Disabled, Restricted, Full) and explicitly asks about legal protections like the RUFADAA (Revised Uniform Fiduciary Access to Digital Assets Act).
  6. `DocumentChecklistScreen`: Final checklist.

### 3.4 Key App Interfaces (`src/components/pages/`)
After onboarding, the user is presented with the application interface. The available views are:
* **Dashboard (`Dashboard.tsx`):** Displays top-line `AssetOverview` components and an `ActionChecklist`.
* **AssetDiscovery (`AssetDiscovery.tsx`):** The primary view for initiating MBOX scans via the backend integration.
* **AllAssets (`AllAssets.tsx`):** A comprehensive grid/list of discovered domains from the parsing engine.
* **ActionItems (`ActionItems.tsx`):** Trackable tasks to accomplish post-discovery (e.g., closing accounts).
* **Documents (`Documents.tsx`):** Digital document management.
* **Settings (`Settings.tsx`):** Application preferences.

### 3.5 Password Manager (`src/components/discovery/PasswordManager.tsx`)
A powerful, built-in credential vault.
- **Features:** 
  - Tracks service name, username, password, category (`streaming`, `finance`, `subscription`, `other`), and confidence level (`High`, `Medium`, `Low`).
  - Implements dynamic password masking with a toggleable eye-icon.
  - Generates instant copy-to-clipboard functionality.
  - Implements a real-time `getPasswordStrength` evaluation (Weak, Fair, Good, Strong) based on string length, capitalization, and special characters.

### 3.6 Frontend Technologies & Helpers
- **Vite:** Blazing fast HMR and optimized production builds.
- **Tailwind CSS:** Fully typed, utility-first CSS classes spanning the entire component tree.
- **Radix UI:** Over 20 accessible headless primitives installed (`@radix-ui/react-dialog`, `react-tabs`, `react-dropdown-menu`, etc.) to guarantee completely compliant overlays, dropdowns, and interfaces.
- **Recharts:** Used to render interactive chart views (such as the asset breakdown).
- **Lucide React:** Sizable icon library embedded in headers, sidebars, and call-to-action buttons.

---

## 4. How Development Works

1. **Install Dependencies:** The root package orchestrates the initial setup via `npm run install:all`.
2. **Start Servers:** `npm run dev` spawns both the backend parsing engine and the Vite server simultaneously. 
3. **CORS:** The backend utilizes the `cors` package so the frontend can dispatch `multipart/form-data` payloads correctly to the Express API locally.
4. **Health State Initialization:** A SIGTERM/SIGINT block gracefully stops the Express server to prevent `EADDRINUSE` errors with nodemon/tsx-watch.
