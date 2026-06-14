# Phase 1 — Repo Orientation Memo

**Repository:** `e-state-accelerator`
**Review basis:** Full static source inspection of all application files
**Prepared for:** Post-course continuation diligence

---

## 1. Repository Structure

```
e-state-accelerator/
├── README.md                      # Minimal; contains stale project references
├── package.json                   # Root orchestrator: runs frontend + backend concurrently
├── .gitignore
├── docs/                          # Created during this review
├── frontend/
│   ├── index.html
│   ├── vite.config.ts             # Vite config with Figma Make versioned aliases
│   ├── package.json
│   └── src/
│       ├── App.tsx                # Root shell + client-side page router (useState)
│       ├── index.css              # Pre-compiled Tailwind v4 output — checked in, not generated
│       ├── vite-env.d.ts
│       ├── Attributions.md        # Acknowledges shadcn/ui and Unsplash via Figma Make
│       ├── components/
│       │   ├── Sidebar.tsx
│       │   ├── DashboardHeader.tsx
│       │   ├── AssetOverview.tsx
│       │   ├── AssetList.tsx
│       │   ├── ActionChecklist.tsx
│       │   ├── pages/             # 6 full-page components
│       │   │   ├── Dashboard.tsx
│       │   │   ├── AssetDiscovery.tsx
│       │   │   ├── AllAssets.tsx
│       │   │   ├── ActionItems.tsx
│       │   │   ├── Documents.tsx
│       │   │   └── Settings.tsx
│       │   ├── discovery/         # Multi-step discovery modal
│       │   │   ├── DiscoveryModal.tsx
│       │   │   ├── SetupView.tsx
│       │   │   ├── ScanningView.tsx
│       │   │   └── ResultsView.tsx
│       │   ├── ui/                # ~30 shadcn/ui primitives (mostly unused)
│       │   └── figma/
│       │       └── ImageWithFallback.tsx
│       ├── hooks/
│       │   └── useEmailScan.ts
│       └── services/
│           └── scanAPI.ts
└── backend/
    ├── tsconfig.json
    ├── package.json
    └── src/
        ├── index.ts               # Express server, port 3002
        ├── routes/
        │   └── scanRoutes.ts      # Single route: POST /api/scan/upload
        └── services/
            ├── mboxParser.ts
            └── signalDetection.ts
```

No database, no environment configuration files (`.env` is gitignored but no `.env.example` exists), no test directories, no CI/CD configuration, no deployment configuration (no Dockerfile, no Procfile, no hosting manifests).

---

## 2. Tech Stack

| Layer | Technologies |
|---|---|
| Frontend runtime | React 18, TypeScript |
| Frontend build | Vite 6, `@vitejs/plugin-react-swc` |
| Frontend styling | Tailwind CSS v4 (pre-compiled output checked in — **not installed as a dependency**) |
| Frontend UI components | Radix UI primitives, shadcn/ui, Lucide React icons |
| Frontend charting | Recharts (installed but not visibly used) |
| Backend runtime | Node.js, Express 4, TypeScript |
| Backend dev tooling | tsx + nodemon |
| Backend file handling | Multer (multipart file uploads) |
| Dev orchestration | `concurrently` at monorepo root |
| UI design origin | **Figma Make** (auto-generated from Figma; explains versioned module aliases in `vite.config.ts` and baked-in CSS) |

**Notable absence:** No database driver, no ORM, no auth library, no test framework, no linter configuration, no formatter configuration.

---

## 3. Application Purpose

AccelEstate is a case management tool for estate executors handling a decedent's digital accounts. The stated purpose is to help an executor:

1. **Discover** what digital accounts the decedent held (via email archive analysis, password manager import, device scan, document upload, manual entry, or browser history review)
2. **Inventory** those accounts with status tracking across a lifecycle: Identified → Accessed → In Progress → Secured
3. **Resolve** each account by working through a guided action checklist (secure access, download data, close or memorialize)
4. **Document** supporting legal and financial records in a case vault

The sidebar shows hardcoded case context ("Case ID: EST-2024-001, Decedent: John Doe"), indicating the intended UX model is a single active estate case per session.

---

## 4. Major Components and Workflows

### 4.1 Backend

Three substantive source files:

**`index.ts`** — Express server boilerplate. Configures CORS (wildcard), JSON body parsing, and mounts scan routes. Includes clean graceful-shutdown logic. No middleware for authentication, rate limiting, or request logging.

**`routes/scanRoutes.ts`** — Single route: `POST /api/scan/upload`. Accepts a multipart MBOX file (up to 5 GB), delegates to `MboxParser` and `SignalDetector`, returns aggregated domain-level account leads as JSON, and deletes the temp file on completion. Error handling is present and covers both Multer errors and processing errors.

**`services/mboxParser.ts`** — Streams and parses MBOX format. Extracts From/To/CC/BCC domains, date, subject, and message-id per message. Normalizes domains to base domain (handles multi-part TLDs like `co.uk`). Expands one row per sending domain. Hardcodes `!== 'enron.com'` as a filter exclusion — a direct artifact of testing against the Enron public email corpus.

**`services/signalDetection.ts`** — Five regex patterns tested against email subjects: auth/security, billing/finance, subscription, loyalty/rewards, cloud/hosting. Scores each message (max 16 points if all signals fire). Aggregates by base domain with first/last seen dates, signal flags, and example subjects. Contains 9 hardcoded brand-name mappings (PayPal, Amazon, Netflix, Spotify, Microsoft, Google, Apple, Facebook, Twitter).

### 4.2 Frontend

**Navigation:** Client-side page router using `useState` in `App.tsx`. Six pages. No URL routing — browser back/forward does not work.

**Dashboard (`Dashboard.tsx`):** Combines `AssetOverview`, `AssetList`, and `ActionChecklist`. All data is hardcoded inline in the component bodies. No connection to backend state.

**Asset Discovery (`AssetDiscovery.tsx` + `DiscoveryModal.tsx`):** Presents six discovery method cards. Clicking any opens a modal. **Only the Email Scan method actually calls the backend.** All other five methods (Password Manager, Device Analysis, Document Upload, Manual Entry, Browser History) run an animated fake scan and return hardcoded mock assets.

**All Assets (`AllAssets.tsx`):** Table of 10 hardcoded assets with filter/sort/search/pagination UI chrome. None of the controls are wired to any logic.

**Action Items (`ActionItems.tsx`):** Three groups of hardcoded tasks. Checkboxes render but have no state toggle logic.

**Documents (`Documents.tsx`):** Upload drop zone, four hardcoded folders, hardcoded storage meter. No upload logic.

**Settings (`Settings.tsx`):** Account info form, password change form, notification toggles (fake), data export/delete buttons. No form submission or persistence.

### 4.3 Discovery Workflow (the one real flow)

```
User selects "Email Scan"
→ SetupView: user selects .mbox/.eml/.txt file
→ DiscoveryModal calls uploadAndScan(file)
→ useEmailScan hook tracks XHR upload progress
→ POST /api/scan/upload (backend)
   → MboxParser streams and parses file
   → SignalDetector classifies and scores domains
   → Returns aggregated domain leads
→ ResultsView displays leads with select/deselect
→ User clicks "Add Assets"
→ Modal closes after 1.5 seconds
→ ** Assets are never persisted anywhere **
```

---

## 5. Signs of Incompleteness and Placeholder Code

**Hardcoded mock data (direct observations):**
- `AssetOverview.tsx:5-9` — stats hardcoded (12 financial, 6 social, etc.)
- `AssetList.tsx:4-40` — 5 fixed asset rows
- `AllAssets.tsx:16-27` — 10 fixed asset rows with hardcoded dates in 2026
- `ActionItems.tsx:5-29` — 9 fixed tasks
- `ActionChecklist.tsx:4-11` — 7 fixed checklist items
- `AssetDiscovery.tsx:128-150` — 4 hardcoded "Recent Discoveries"
- `Sidebar.tsx:49-51` — `"Case ID: EST-2024-001"`, `"Decedent: John Doe"` hardcoded
- `Documents.tsx:4-17` — hardcoded folders, file names, sizes
- `ScanningView.tsx:17-50` — `mockAssets` map with hardcoded results per non-email discovery method

**Broken confidence scoring:**
`ResultsView.tsx:13-14` classifies `score > 75` as High, `score > 50` as Medium, else Low. The actual scoring ceiling in `signalDetection.ts:74-82` is 16 points (5+4+3+2+2). Every real scan result will display "Low" confidence regardless of quality.

**"Add Assets" is a dead end:**
`DiscoveryModal.tsx:83-88` — the add-assets handler closes the modal after a 1.5-second delay. Results are never stored or reflected anywhere in the UI.

**Dead UI controls:**
- Search inputs in `AssetList` and `AllAssets` — no `onChange` or `onSubmit`
- Filter `<select>` elements in `AllAssets` — no handler
- Pagination buttons in `AllAssets` — no handler
- "Add Asset", "Export" buttons in `AllAssets` — no handler
- Notification toggles in `Settings` — fake `<div>` elements, not `<input type="checkbox">`
- Checkbox buttons in `ActionItems` and `ActionChecklist` — render only, no state updates

**Stale naming artifacts:**
- `backend/package.json` name: `"enron-scanner-backend"` (three different project names across the three `package.json` files)
- `mboxParser.ts:221` — hardcoded `!== 'enron.com'` filter
- `README.md` — references directory `enron_scanner_app/`

**CSS architecture issue:**
`index.css` is a pre-compiled Tailwind v4 output (1,630 lines). Tailwind is absent from `package.json`. This is a Figma Make export artifact. Adding new Tailwind utility classes to components will silently break unless the build pipeline is reconfigured.

**Unused UI library:**
The `frontend/src/components/ui/` directory contains ~30 shadcn/ui components (accordion, calendar, carousel, chart, command palette, OTP input, etc.) that are not used by any page. They are Figma Make boilerplate.

---

## 6. Recommended Next Inspection Steps

1. **Run the MBOX scan end-to-end.** The backend logic is the only substantive working feature. Validate it against a real Google Takeout `.mbox` export. Confirm the confidence scoring bug manifests as predicted and assess whether domain aggregation results are actually useful.

2. **Check git branch history.** The commit log shows a `figma-ui-integration` branch was merged. Inspecting that merge would clarify how much UI work preceded the backend, and whether any functionality was lost or deferred during integration.

3. **Verify the build from a clean install.** The Figma Make versioned aliases in `vite.config.ts` and the baked-in CSS suggest a fragile build setup. Confirm `npm run install:all && npm run build` completes without errors before assuming the project is portable.

4. **Enumerate the unused `ui/` components.** Determine whether any of the ~30 shadcn/ui components are intentionally reserved for near-term use or are pure artifact bloat that should be removed.

5. **Interview the team on intended scope for non-MBOX discovery methods.** The five mocked methods (password manager, device, document, browser, manual) span dramatically different technical complexity and privacy/legal surface area. Understanding which were intended to be real informs the gap between demo and product.
