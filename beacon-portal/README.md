# Beacon — AI Accessibility Audit & Remediation Portal

A frontend for a service that crawls submitted pages, records WCAG findings with
screenshots, drafts AI explanations and safe code suggestions, and organizes
remediation work by severity, team member and history. This repo contains the
UI only, wired to realistic mock data — connect it to a real crawler/scanner
backend to make it live.

## Quick preview (no install needed)

Open `preview.html` directly in any browser (double-click it, or drag it into
a browser tab). It loads React, Recharts and Babel from a CDN and runs the
whole app client-side, so you can see every screen immediately.

## Full project (recommended for development)

This is a normal Vite + React project.

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Structure

```
index.html          Vite entry HTML
preview.html         Standalone, build-free preview (open directly in a browser)
src/
  main.jsx           React root
  App.jsx            The entire app (dashboard, findings, scans, team, reports)
  index.css          Base reset
package.json
vite.config.js
```

## What's implemented (with mock data)

- Dashboard: score history chart, severity breakdown, recent scans
- Findings: severity/status/page filters, expandable rows with a mock
  screenshot preview highlighting the violating element, AI explanation of
  the WCAG success criterion, before/after code suggestion, assignment and
  status controls
- Scans & regression: submit a URL to simulate a new audit, toggle weekly
  automated regression scans, view run history with score deltas
- Team: open/resolved counts per assignee
- Reports & exports: working CSV export and a print-to-PDF summary

## Wiring up a real backend

To make this live you'd add a backend service that:
1. Accepts a submitted URL, renders it in a headless browser (e.g. Playwright)
2. Runs an automated WCAG ruleset (e.g. axe-core) against the rendered DOM
3. Captures a screenshot and the bounding box of each violating element
4. Sends findings to an LLM to draft a plain-language explanation and a
   proposed code fix (always labelled as a draft, never as guaranteed
   compliance)
5. Persists findings, scores over time, and assignments in a database

The frontend already expects data shaped like the mock objects in `App.jsx`
(`findings`, `scans`, `history`), so swapping mock data for API calls is the
main integration step.
