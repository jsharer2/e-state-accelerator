# AccelEstate Project Guidelines

## Purpose

This document provides project context, implementation intent, usage instructions, and handoff notes for teammates, instructors, and project partner continuity.

## Product Intent

The app helps identify potential digital assets by analyzing mailbox exports and ranking external account domains based on message-level signals.

## Intended User Journey

1. User creates account or logs in.
2. User completes onboarding prompts.
3. User uploads mailbox export file.
4. User reviews discovered account leads and signal indicators.
5. User saves scan history for later action.

## What Counts as a "Signal"

Signals are keyword-based indicators derived primarily from subject lines. The current signal categories are:
- Authentication/security events
- Billing/financial activity
- Subscription lifecycle events
- Rewards/loyalty activity
- Hosting/cloud/domain operations

Signals are weighted to rank likely account relevance.

## Data Pipeline Summary

1. Receive file upload at backend scan route.
2. Parse MBOX-style message blocks.
3. Extract and normalize email domains.
4. Expand domain evidence records.
5. Score each message by signal matches.
6. Aggregate by base domain and return ranked results.

## Supported Input

- File extensions: `.mbox`, `.txt`, `.eml`
- Max upload size: 5 GB
- Transport: multipart form upload field named `file`

## Security and Privacy Notes

- Treat mailbox data as sensitive.
- Use non-production data for demos when possible.
- Rotate and protect `JWT_SECRET` in non-local deployments.
- Avoid sharing raw uploaded email files in public channels.
- Restrict database access to authorized team members.

## Environment and Deployment Notes

Backend environment variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (optional, default 3002)

Frontend environment variable:
- `VITE_API_URL` (optional, defaults to localhost backend)

## Manual QA Checklist

- Register with valid credentials.
- Log in with existing credentials.
- Complete onboarding and refresh to verify persistence.
- Upload valid mailbox file and verify progress indicator.
- Confirm results render with totals and domain leads.
- Save scan result and verify scan history retrieval.
- Confirm unauthorized requests are rejected without token.

## Known Limitations

- Signal detection is heuristic and subject-keyword based.
- Brand mapping dictionary is limited and partially hardcoded.
- Domain normalization is not based on full public suffix data.
- Upload endpoint does not yet include advanced malware/content scanning.

## Recommended Next Improvements

- Add automated test coverage for parser edge cases.
- Add integration tests for auth and scan routes.
- Add role-based auth and stronger password policies.
- Add richer observability (structured logs + request tracing).
- Add pagination/filtering for large scan histories.

## Team Communication and Handoff

- Keep README as source of truth for setup and API contracts.
- Record significant architecture changes in this file.
- Share partner handoff links through GitHub repository access.
- Include professors and all team members in official transition emails.
