# MedConnect

A responsive, accessible front-end prototype of a practice management suite for
UK GP surgeries, dental practices and physiotherapy clinics.

> **This is a user-interface demonstration only.** Every patient, clinician,
> appointment and metric is fictional. There is no backend, no database, no
> authentication, no messaging, no calendar synchronisation, no video
> transport and no encryption. Integration panels exist to show how those
> surfaces would be presented and configured — they are deliberately inert.

## Screens

| Route | Description |
| --- | --- |
| `/` | Practice overview: today's list, no-show risk, queues, activity, charts |
| `/appointments` | Day/week scheduling with no-show risk and reminder delivery state |
| `/patients` | Searchable patient directory with risk banding and filters |
| `/patients/:id` | Patient profile: summary, medications, history, forms, documents |
| `/intake-forms` | Review queue, patient-facing form preview, template library |
| `/consultation` | Video consultation room, waiting room, in-call notes |
| `/prescriptions` | Batched repeat approvals with monitoring/interaction warnings |
| `/rota` | Weekly rota plus clinician utilisation and performance indicators |
| `/settings` | Practice config, reminder policy, team access, integration surfaces |

## Stack

TanStack Start (TanStack Router, React 19), TypeScript, Tailwind CSS v4,
Radix UI primitives, Recharts, Lucide icons.

## Running locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev      # http://localhost:8080
```

Other commands:

```sh
npm run build    # production build
npm run preview  # serve the production build
```

## Project structure

```
src/
  components/
    app-shell.tsx     navigation shell, header, theme toggle, demo banner
    clinical.tsx      shared clinical UI: risk, reminder and status badges
    ui/               Radix-based component primitives
  lib/
    mock-data.ts      all fictional demo data in one module
    utils.ts          class-name helper
  routes/             file-based routes (one file per screen)
  styles.css          design tokens and Tailwind theme
```

All demo data lives in `src/lib/mock-data.ts`. Replacing that module with real
data sources is the natural first step toward a working application.

## Design notes

- Colour, radius, shadow and typography are semantic tokens in `src/styles.css`;
  components never hard-code colours, so light and dark themes both work.
- Clinical status is always conveyed by text and icon as well as colour.
- Text contrast targets WCAG 2.2 AA; interactive elements are keyboard reachable
  with a visible focus ring, and a skip link precedes the navigation.
- Layouts reflow to a single column without horizontal scrolling at 320px.

## Licence

Provided as-is for demonstration and evaluation purposes.
