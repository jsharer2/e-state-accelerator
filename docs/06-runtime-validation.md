# Phase 6 — Runtime Validation

**Repository:** `e-state-accelerator`
**Environment:** Linux (WSL2), Node.js v24.12.0, npm 11.6.2
**Approach:** Conservative local execution — no external services, no real user data, synthetic test MBOX file

---

## Setup Steps Performed

### 1. Prerequisite Check

```bash
node --version   # v24.12.0 (well above the stated requirement of 18+)
npm --version    # 11.6.2
```

No missing system prerequisites. Node.js and npm are present and current.

### 2. Dependency Installation

```bash
npm run install:all
```

**Result: Success.** All three package trees (root, frontend, backend) installed without errors.

**Notable warnings:**
- `multer@1.4.5-lts.2` deprecation warning: "Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x." This is the version used by the backend for file upload handling. This is a known security issue in the dependency and should be upgraded.
- No missing peer dependencies.

### 3. Backend Build

```bash
npm run build:backend   # Runs: cd backend && tsc
```

**Result: Success.** TypeScript compiled without errors to `backend/dist/`.

**Critical issue discovered:** The production build cannot be run with `node dist/index.js`.

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
'.../backend/dist/routes/scanRoutes' imported from
'.../backend/dist/index.js'
```

**Root cause:** The backend uses `"module": "ES2022"` in `tsconfig.json` (ESM output) but TypeScript compiles relative imports without `.js` extensions (e.g., `import scanRoutes from "./routes/scanRoutes"`). Node.js ESM requires explicit `.js` extensions for relative imports. The compiled output is therefore not directly runnable with `node`.

**Impact:** The `npm start` script (`node dist/index.js`) does not work. The development runner (`tsx src/index.ts`) works correctly and was used for testing. Any production deployment would need to either: (a) fix the tsconfig to use `"moduleResolution": "bundler"` with explicit `.js` extensions in source imports, (b) use a bundler for the backend output, or (c) switch to `tsx` or a similar transpiling runner for production.

### 4. Frontend Build

```bash
npm run build:frontend   # Runs: cd frontend && vite build
```

**Result: Success.** Vite produced a production build in `frontend/build/`.

```
build/index.html                   0.44 kB │ gzip:  0.29 kB
build/assets/index-DqkzyjCN.css   26.18 kB │ gzip:  5.62 kB
build/assets/index-CQMXijdY.js   211.26 kB │ gzip: 60.40 kB
✓ built in 1.81s
```

The Vite build succeeds, including all the versioned alias resolution in `vite.config.ts`. Bundle size is 211 KB JS / 26 KB CSS, which is reasonable for a React application of this scale.

**Security note:** A moderate severity vulnerability was detected in Vite 6.0.0–6.4.0:
- Vite middleware may serve files starting with the same name as the public directory
- `server.fs` settings were not applied to HTML files
- A server filesystem bypass via backslash on Windows

These are dev-server vulnerabilities and do not affect the production build output. Upgrading to Vite 6.4.1+ would resolve them.

---

## Runtime Test: Backend MBOX Scan

The backend was started using the development runner:

```bash
cd backend && ./node_modules/.bin/tsx src/index.ts
```

**Health check confirmed:**
```
GET /api/health → {"status":"ok","message":"Backend is running"}
```

### Synthetic MBOX Test File

A realistic test MBOX file was constructed with 12 messages from 11 distinct sending domains, covering typical estate-context account types: financial (PayPal, Chase, Coinbase, E*TRADE), streaming (Netflix, Spotify), cloud/storage (Dropbox), tech (Apple, Amazon), professional (LinkedIn), and domain registrar (GoDaddy).

### Scan Results

```
POST /api/scan/upload → 200 OK
{
  "total_messages": 12,
  "total_evidence_rows": 12,
  "total_domains": 11
}
```

All 12 messages were parsed. All 11 domains were extracted. The scan completed and returned results. **The core MBOX parsing and signal detection pipeline works end-to-end.**

### Signal Detection Accuracy (Against Test File)

| Domain | Expected Signals | Detected | Score | Notes |
|---|---|---|---|---|
| godaddy.com | billing + subscription + cloud | billing + subscription + cloud | 9 | Correct |
| dropbox.com | billing + subscription | billing + subscription | 7 | Correct |
| amazon.com | auth | auth | 5 | Correct ("New sign-in") |
| etrade.com | auth | auth | 5 | Correct ("verification required") |
| paypal.com | billing + auth | billing only | 4 | **Partial miss** — see below |
| coinbase.com | billing | billing | 4 | Correct |
| chase.com | billing | billing | 4 | Correct |
| apple.com | billing | billing | 4 | Correct |
| netflix.com | subscription | subscription | 3 | Correct |
| spotify.com | subscription | subscription | 3 | Correct |
| linkedin.com | none (profile view) | none | 0 | Correct |

**One partial detection miss identified:** PayPal had two messages — a receipt (billing) and a password reset. The auth signal did not fire for "Reset your PayPal password" because the regex pattern `reset\s*your\s*password` requires the words to be adjacent, but the actual subject has the service name between "your" and "password" ("Reset your **PayPal** password"). The pattern `reset\s*your\s*password` does not allow for an intervening word. This is a real false negative in the detection logic.

**Overall signal detection accuracy on this test: 10/11 correct, 1 partial miss.** Results are directionally useful.

### Confidence Scoring Bug Confirmed

The maximum score in the test was 9 (godaddy.com). The confidence thresholds in `ResultsView.tsx` are:
- `score > 75` → High
- `score > 50` → Medium
- else → Low

**Result: Every single domain in the test displayed as "Low" confidence.** This includes PayPal (2 messages, billing signals), GoDaddy (billing + subscription + cloud, score 9), and E*TRADE (auth signals). The bug is confirmed to produce a universally misleading UI.

### Temp File Cleanup

After the scan completed successfully, no residual upload files were found in the OS temp directory. **Temp file cleanup works correctly.**

### Error Handling Tests

**Invalid content (non-MBOX text file with `.txt` extension):**
```json
{"success": true, "data": {"total_messages": 0, "total_evidence_rows": 0, "total_domains": 0, "accounts": []}}
```
The backend returns a successful empty result rather than an error. A non-MBOX text file is parsed but yields zero messages. This is acceptable behavior — no crash, no data leak.

**Unsupported file type (`.pdf` extension):**
```json
{"error": "Only MBOX files are supported"}
```
File type rejection works correctly at the Multer filter level.

---

## What Was NOT Tested

- **Frontend in the browser** — The frontend was built successfully but not served or manually tested. The browser-based MBOX upload flow and the "Add Assets" dead end could not be confirmed to work visually, only by code inspection.
- **Large file handling** — The 5 GB claim was not stress-tested. Memory behavior under large files is a known concern (the buffer accumulation pattern in `mboxParser.ts`).
- **Real email archive** — The test used a synthetic 12-message MBOX. A Google Takeout MBOX with thousands of messages and varying encoding, headers, and attachment data was not tested.
- **Concurrent requests** — No concurrency testing was performed.
- **Frontend dev server** — The Vite dev server was not started (would open a browser automatically per `vite.config.ts:58`).

---

## Summary of Runtime Findings

| Test | Result | Notes |
|---|---|---|
| `npm run install:all` | Pass | Multer deprecation warning noted |
| `npm run build:frontend` | Pass | 211 KB bundle; Vite vulnerability noted |
| `npm run build:backend` | Pass (tsc) | **Fail** (`node dist/`) — ESM extension bug |
| Backend health check | Pass | Responds correctly |
| MBOX scan — parsing | Pass | All 12 messages extracted |
| MBOX scan — signal detection | Pass (10/11) | One regex false negative (PayPal auth) |
| MBOX scan — temp file cleanup | Pass | No residual files |
| Confidence scoring | Confirmed broken | All results show "Low"; max observed score 9 vs threshold 75 |
| Error handling — bad content | Pass | Returns empty results, no crash |
| Error handling — wrong type | Pass | Correctly rejected |
| Production backend start | **Fail** | ESM module resolution bug in `node dist/index.js` |

---

## Additional Issues Surfaced by Runtime Testing

1. **Production deployment of the backend is broken.** `node dist/index.js` does not work due to the TypeScript ESM compilation issue. The `package.json` `start` script is non-functional as written. Any deployment would need to use `tsx` directly, use a bundler, or fix the TypeScript configuration.

2. **The auth regex has a false negative for compound subject lines.** "Reset your [Service Name] password" does not match `reset\s*your\s*password`. A minor regex adjustment could fix this.

3. **Empty MBOX returns success with zero results rather than a user-friendly message.** A non-MBOX file appears to succeed with zero results. In the frontend context, this would show "Scan Complete — Found 0 potential assets" with no explanation of why.

4. **Brand recognition is demonstrably limited.** E*TRADE, Coinbase, Dropbox, Chase, GoDaddy, and LinkedIn were not recognized as named brands — they appear by domain only. Only Amazon, Apple, Netflix, Spotify, and PayPal returned brand names. Expanding the brand mapping is a clear near-term improvement.

---

## Runtime Validation Conclusion

The MBOX scanning backend is functionally correct and produces useful output. It parses standard MBOX format, extracts domains, classifies signal types, and returns ranked results. For the intended use case (identifying digital accounts from an email archive), the feature works as designed.

The confidence scoring bug is confirmed and significant: it makes every scan result appear as "Low" confidence regardless of actual signal strength, which would confuse or mislead users.

The production deployment path (`node dist/`) is broken and requires a fix before any real deployment. Development mode (`tsx`) works correctly.

The frontend build succeeds and produces a valid bundle, but the browser-based experience was not validated. The critical issue — that "Add Assets" saves nothing — is confirmed by code inspection but was not interactively tested.

**Overall runtime assessment:** The core feature works. The deployment path needs fixing. The confidence scoring needs immediate correction. Signal detection is directionally sound but has detectable gaps (regex edge cases, limited brand coverage).
