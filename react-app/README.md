# FLOORLINE — React version

Standard Vite + React project.

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build -> dist/
```

A pre-built `dist/` is already included in this zip (built offline in the
sandbox that generated this project, see the top-level README for how and
why), so you can also just open `dist/index.html` directly with zero
install if you only want to look at it.

## Structure

```
src/
  main.jsx              entry point
  App.jsx                root component, wires the simulation hook to all panels
  index.css              theme (dark industrial palette)
  data/
    plants.js            plants, stations, role permissions
    manuals.js            equipment manual snippets + keyword retrieval
  hooks/
    useSimulation.js      streaming OEE/defects/downtime/alerts engine + resilient reconnect
    useManualCache.js     in-memory cache wrapper around manual retrieval
  components/
    Header.jsx, KpiRow.jsx, OeeChart.jsx, DefectChart.jsx,
    DowntimeLog.jsx, AlertsPanel.jsx, ManualSearch.jsx
```

The `backend/` folder from the top-level project (Node/Express + WebSocket
reference server) is a drop-in data source for this frontend — swap the
`useSimulation` hook's in-memory tick loop for a `WebSocket` subscription
to `/stream?plant=...` and the REST calls in `App.jsx`'s `exportCsv` /
`acknowledge` for calls to `/api/...` to go from demo to networked app.
