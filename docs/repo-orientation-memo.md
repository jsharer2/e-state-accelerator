# Repo Orientation Memo: AccelEstate (e-state-accelerator)

**Prepared for:** Northwestern Law Innovation Lab review
**Repository:** `e-state-accelerator`
**Review basis:** Full source inspection, all application files read

---

## 1. Repository Structure

```
e-state-accelerator/
├── package.json              # Root orchestrator (runs frontend + backend concurrently)
├── frontend/                 # React SPA
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── src/
│       ├── App.tsx           # Root shell + client-side router
│       ├── index.css         # Pre-compiled Tailwind v4 output (baked in, not a build step)
│       ├── components/
│       │   ├── pages/        # 6 page-level components
│       │   ├── discovery/    # 4 components for the scan workflow modal
│       │   ├── ui/           # ~30 shadcn/ui primitives (mostly unused)
│       │   └── figma/        # Image helper from Figma Make
│       ├── hooks/useEmailScan.ts
│       └── services/scanAPI.ts
└── backend/
    ├── package.json
    └── src/
        ├── index.ts          # Express server, port 3002
        └── routes/scanRoutes.ts
        └── services/
            ├── mboxParser.ts
            └── signalDetection.ts
```

No database, no environment configuration files, no test directories, no deployment configuration anywhere in the tree.

---

## 2. Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite 6, Tailwind CSS v4 (pre-compiled), Radix UI primitives, shadcn/ui, Lucide icons, Recharts (installed, not used) |
| Backend | Node.js, Express 4, TypeScript, Multer (file upload) |
| Build tooling | Vite (frontend), tsx + nodemon (backend dev), tsc (backend prod build) |
| Dev orchestration | `concurrently` at root |
| UI origin | Figma Make (auto-generated from a Figma design; explains the `vite.config.ts` versioned aliases and pre-compiled CSS) |

Notable: Tailwind is **not installed as a dependency**. Instead, the full compiled CSS is checked in at `src/index.css` (1,630 lines). This is a Figma Make export artifact and means Tailwind cannot be extended without a toolchain reconfiguration.

---

## 3. Application Purpose and Major Workflows

**AccelEstate** is a case management tool for estate executors dealing with a decedent's digital accounts. The intended workflow has three phases:

**Phase 1 — Discovery:** Identify what digital accounts the decedent had, via multiple input methods (email archive, password manager export, device scan, document upload, manual entry, browser history).

**Phase 2 — Inventory Management:** Track discovered accounts in a structured asset register with status tracking (Identified → Accessed → In Progress → Secured).

**Phase 3 — Resolution:** Work through an action item checklist to secure, download data from, or close each account; maintain a document vault of supporting legal/financial records.

The sidebar also shows a hardcoded case context ("Case ID: EST-2024-001, Decedent: John Doe"), indicating the intended UX is a per-estate case file.

---

## 4. Major Components/Modules

### Backend (3 functional files)

| File | Role | Quality |
|---|---|---|
| `index.ts` | Express server, CORS, graceful shutdown | Solid, basic |
| `routes/scanRoutes.ts` | Single endpoint: `POST /api/scan/upload`. Accepts MBOX file via multipart, orchestrates parse → detect → aggregate → respond | Functional, well-structured |
| `services/mboxParser.ts` | Streams and parses MBOX format. Extracts per-message header metadata (From/To/CC/BCC domains, date, subject, message-id). Normalizes to base domains (handles multi-part TLDs). | Substantive and reasonably well-written. Main logic is sound. |
| `services/signalDetection.ts` | Runs 5 regex patterns against email subjects to classify signal type (auth, billing, subscription, rewards, cloud). Scores each message. Aggregates by base domain. Returns sorted results. | Functional. Only 9 hardcoded brand-to-name mappings (PayPal, Amazon, Netflix, etc.). Confidence scoring is miscalibrated (see §5). |

### Frontend (6 pages)

| Page | What's Real | What's Mock |
|---|---|---|
| **Dashboard** | Navigation, layout | All stats (27 assets, 8 secured), all asset list items, all checklist items — hardcoded |
| **Asset Discovery** | Layout, 6 method cards, modal shell, Email Scan (MBOX upload → real API) | All other 5 methods (Password, Device, Document, Browser, Manual) trigger animated fake scans with hardcoded result sets |
| **All Assets** | Layout, filter/sort UI chrome | All 10 asset rows are hardcoded; filter selects and search do nothing; pagination does nothing |
| **Action Items** | Layout | All 9 action items are hardcoded; checkboxes have no state |
| **Documents** | Upload UI chrome | No actual file upload logic; folder counts and storage meter are hardcoded |
| **Settings** | Form fields render | No form submission or persistence of any kind |

---

## 5. Signs of Incompleteness and Placeholder Code

The following are concrete findings, not speculation:

**Hardcoded mock data throughout:**
- `AssetOverview.tsx:5-9` — stat cards with fixed numbers
- `AssetList.tsx:4-40` — 5 hardcoded assets
- `AllAssets.tsx:16-27` — 10 hardcoded assets
- `ActionItems.tsx:5-29` — 9 hardcoded tasks
- `ActionChecklist.tsx:4-11` — 7 hardcoded items
- `AssetDiscovery.tsx:128-150` — 4 hardcoded "Recent Discoveries"
- `Sidebar.tsx:49-51` — hardcoded "John Doe" case context
- `Documents.tsx:4-17` — hardcoded folders and files

**Broken confidence scoring:**
`ResultsView.tsx:13-14` classifies confidence as `High` if `score > 75`, `Medium` if `score > 50`. But the scoring system (in `signalDetection.ts:74-82`) gives a maximum of 16 points (5+4+3+2+2) if all five signals fire on a single message. In practice, most real results will score 3–10 total. This means every scan result will display as "Low" confidence, making the UI misleading.

**"Add Assets" button is a dead end:**
`DiscoveryModal.tsx:83-88` — clicking "Add Assets" closes the modal after 1.5 seconds. Discovered assets are never written anywhere. The Dashboard will still show the hardcoded mock data unchanged.

**5 of 6 discovery methods are pure demo:**
`ScanningView.tsx:17-50` — each non-email method has a `mockAssets` block with hardcoded results that play back via a fake animation timer.

**Stale naming artifacts from prior prototype:**
- `backend/package.json` name: `"enron-scanner-backend"`
- `backend/src/services/mboxParser.ts:221` hardcodes `!== 'enron.com'` as an exclusion filter (a leftover from testing against the Enron public email dataset)
- `README.md` references directory `enron_scanner_app/` (old project name)
- Root `package.json` name: `"asset-discovery-app"` (a third name)

**No interactivity on most UI controls:**
- Search inputs in AssetList and AllAssets have no `onChange` handler
- Filter selects in AllAssets do nothing
- Pagination buttons in AllAssets do nothing
- "Add Asset" and "Export" buttons have no handlers
- Toggle switches in Settings are fake (hand-crafted div, no state)

**No state persistence of any kind:**
No database, no localStorage, no session state. Every page refresh resets everything.

**No authentication:**
No login, no auth middleware, no user identity concept.

**Pre-compiled CSS locked in:**
`index.css` is a Tailwind build output, not a source file. Adding new Tailwind classes requires either reconfiguring the build pipeline or editing the compiled CSS directly.

---

## 6. Recommended Additional Inspection Steps

Before a full assessment, the following would sharpen the picture:

1. **Run the application end-to-end.** Verify the MBOX scan actually works against a real mailbox export (e.g., a Google Takeout `.mbox` file). The backend logic looks plausible but has not been smoke-tested here. Check whether the confidence scoring bug surfaces as predicted.

2. **Check git history depth.** The commit log (`d37c72f "email scanning functionality added"`, `de261b0 "backend setup"`, `ce04bb1 "Merge branch 'figma-ui-integration'"`) suggests the backend and UI were developed on separate branches and merged. Inspecting those branches would reveal how much was developed independently vs. integrated, and whether there were any working integrations that regressed.

3. **Assess the signal detection quality against a real dataset.** The regex patterns and scoring weights are the core "AI" of the product. Feeding a sample MBOX through the backend and reviewing the output would reveal whether the detection is actually useful or generates too much noise/too few hits to be actionable.

4. **Verify the Vite/Tailwind build succeeds from a clean install.** The versioned aliases in `vite.config.ts` and the baked-in CSS suggest a fragile build setup from a Figma Make export. Confirm `npm run install:all && npm run build` completes without errors.

5. **Review the UI component library footprint.** The `frontend/src/components/ui/` directory contains ~30 shadcn/ui components (accordion, carousel, calendar, chart, OTP input, etc.) that appear to be unused boilerplate from the Figma Make export. Clarify whether any of these are intentionally reserved for future features or are just bulk.

6. **Clarify the product concept for non-MBOX data sources.** Five of the six discovery methods (password manager, device, document, browser, manual) are currently mocked. Understanding which of these the team intends to build would define the scope and complexity of the real work ahead.

---

## Summary Characterization (Pre-Assessment)

The project has a clear and well-defined problem space, a coherent UI skeleton, and one genuine working capability: MBOX email parsing and domain-level signal detection. The backend for that one capability is written competently. The frontend shell is visually complete and navigable.

Everything else — the dashboard, asset management, action items, documents, settings, and five of six discovery methods — is either hardcoded mock data or non-functional UI chrome. There is no data persistence, no authentication, and no way for the working backend capability to propagate its results into the rest of the application.

The project is best understood as a high-fidelity clickable prototype with one real feature grafted on. That is a reasonable deliverable for an Innovation Lab course, but it is not a functional product.
