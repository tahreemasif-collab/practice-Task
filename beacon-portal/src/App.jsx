import React, { useState, useMemo, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import {
  LayoutDashboard, ListChecks, Users, RadarIcon, FileDown, Globe, Search,
  ChevronDown, ChevronRight, Copy, Check, AlertTriangle, AlertOctagon,
  AlertCircle, Info, Clock, RefreshCw, PlusCircle, X, Camera, Sparkles,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Design tokens                                                          */
/* ---------------------------------------------------------------------- */

const T = {
  bg: "#10151C",
  surface: "#182029",
  raised: "#202A35",
  border: "#2B3542",
  borderSoft: "#232D38",
  text: "#ECEFF3",
  dim: "#8D97A5",
  faint: "#5C6675",
  accent: "#33D6C0",
  accentDim: "#1F5C54",
  critical: "#FF5A5F",
  serious: "#FF9F45",
  moderate: "#F5CB5C",
  minor: "#5FA8D3",
  pass: "#4FCE85",
};

const SEVERITY = {
  critical: { label: "Critical", color: T.critical, icon: AlertOctagon },
  serious: { label: "Serious", color: T.serious, icon: AlertTriangle },
  moderate: { label: "Moderate", color: T.moderate, icon: AlertCircle },
  minor: { label: "Minor", color: T.minor, icon: Info },
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

/* ---------------------------------------------------------------------- */
/*  Mock data                                                              */
/* ---------------------------------------------------------------------- */

const TEAM = [
  { id: "t1", name: "Priya Nandakumar", role: "Frontend eng", color: "#33D6C0" },
  { id: "t2", name: "Owen Baptiste", role: "Design systems", color: "#5FA8D3" },
  { id: "t3", name: "Lena Sorokin", role: "QA / accessibility", color: "#F5CB5C" },
  { id: "t4", name: "Marcus Diallo", role: "Frontend eng", color: "#FF9F45" },
  { id: "unassigned", name: "Unassigned", role: "", color: "#5C6675" },
];

const SCANS = [
  { id: "s1", url: "marketing.northwind.app", date: "2026-09-10", score: 78, pageType: "marketing" },
  { id: "s2", url: "app.northwind.app/settings", date: "2026-09-08", score: 61, pageType: "form" },
  { id: "s3", url: "docs.northwind.app/guide", date: "2026-09-05", score: 84, pageType: "article" },
];

const HISTORY = [
  { date: "Jul 14", score: 52 },
  { date: "Jul 28", score: 58 },
  { date: "Aug 11", score: 55 },
  { date: "Aug 25", score: 66 },
  { date: "Sep 05", score: 72 },
  { date: "Sep 10", score: 74 },
];

const FINDINGS = [
  {
    id: "f1", scanId: "s1", severity: "critical", level: "AA", sc: "1.4.3",
    scName: "Contrast (Minimum)", page: "marketing.northwind.app", pageType: "marketing",
    element: "button.cta-primary", status: "open", assignee: "t1",
    highlight: { x: 150, y: 92, w: 90, h: 22 },
    summary: "Primary CTA button text fails minimum contrast.",
    ai: "The button text is #B7FF6E on a #8FE054 background, giving a contrast ratio of about 1.6:1. WCAG 2.2 requires at least 4.5:1 for normal-sized text. Screen reader users aren't affected by this directly, but many low-vision and colorblind users will struggle to read the label at all.",
    before: `.cta-primary {\n  background: #8FE054;\n  color: #B7FF6E;\n}`,
    after: `.cta-primary {\n  background: #2F7A3C; /* darker brand green */\n  color: #FFFFFF;      /* ratio ~7.1:1 */\n}`,
  },
  {
    id: "f2", scanId: "s1", severity: "serious", level: "A", sc: "1.1.1",
    scName: "Non-text Content", page: "marketing.northwind.app", pageType: "marketing",
    element: "img.hero-illustration", status: "in-progress", assignee: "t2",
    highlight: { x: 30, y: 45, w: 120, h: 45 },
    summary: "Hero illustration has no accessible name.",
    ai: "The hero <img> has no alt attribute, so screen readers announce the filename ('hero_v3_final.png'). Because the image is purely decorative (the same message is repeated in the adjacent heading), the fix is to mark it as decorative rather than write a caption.",
    before: `<img src="/hero_v3_final.png" class="hero-illustration">`,
    after: `<img src="/hero_v3_final.png" class="hero-illustration" alt="">`,
  },
  {
    id: "f3", scanId: "s1", severity: "moderate", level: "AA", sc: "2.4.7",
    scName: "Focus Visible", page: "marketing.northwind.app", pageType: "marketing",
    element: "a.nav-link", status: "open", assignee: "unassigned",
    highlight: { x: 60, y: 8, w: 40, h: 8 },
    summary: "Nav links suppress the focus outline.",
    ai: "The stylesheet sets outline: none on all anchors and never restores a substitute focus style. Keyboard users tabbing through the top navigation currently have no way to see which link is focused.",
    before: `a { outline: none; }`,
    after: `a { outline: none; }\na:focus-visible {\n  outline: 2px solid #33D6C0;\n  outline-offset: 2px;\n}`,
  },
  {
    id: "f4", scanId: "s2", severity: "critical", level: "A", sc: "4.1.2",
    scName: "Name, Role, Value", page: "app.northwind.app/settings", pageType: "form",
    element: "div.toggle-switch", status: "open", assignee: "t4",
    highlight: { x: 250, y: 120, w: 40, h: 16 },
    summary: "Custom toggle switch is invisible to assistive tech.",
    ai: "The 'Email notifications' control is a styled <div> with a click handler. It has no role, no accessible name, and no way to report its checked state, so screen reader users can't tell it exists, let alone what it does.",
    before: `<div class="toggle-switch" onclick="toggle()"></div>`,
    after: `<button\n  role="switch"\n  aria-checked={isOn}\n  aria-label="Email notifications"\n  onClick={toggle}\n  class="toggle-switch"\n></button>`,
  },
  {
    id: "f5", scanId: "s2", severity: "serious", level: "A", sc: "3.3.2",
    scName: "Labels or Instructions", page: "app.northwind.app/settings", pageType: "form",
    element: "input#display-name", status: "open", assignee: "t1",
    highlight: { x: 40, y: 70, w: 160, h: 18 },
    summary: "'Display name' field has a placeholder but no label.",
    ai: "The input relies on placeholder text for its label. Placeholder text disappears once typing starts and is not reliably exposed as a label by all assistive technology, so the field's purpose can be lost for screen reader and low-vision users.",
    before: `<input id="display-name" placeholder="Display name">`,
    after: `<label for="display-name">Display name</label>\n<input id="display-name" placeholder="e.g. Priya N.">`,
  },
  {
    id: "f6", scanId: "s2", severity: "moderate", level: "AA", sc: "1.4.3",
    scName: "Contrast (Minimum)", page: "app.northwind.app/settings", pageType: "form",
    element: "span.field-hint", status: "resolved", assignee: "t3",
    highlight: { x: 40, y: 92, w: 130, h: 10 },
    summary: "Helper text under the password field is low contrast.",
    ai: "The hint 'Must be at least 12 characters' is set in #9AA4B2 on a #182029-ish panel, roughly 3.1:1. It's small print conveying a real requirement, so it needs to clear the 4.5:1 threshold.",
    before: `.field-hint { color: #9AA4B2; }`,
    after: `.field-hint { color: #C3CBD6; }`,
  },
  {
    id: "f7", scanId: "s2", severity: "minor", level: "AAA", sc: "2.4.6",
    scName: "Headings and Labels", page: "app.northwind.app/settings", pageType: "form",
    element: "h2.section-title", status: "open", assignee: "unassigned",
    highlight: { x: 30, y: 30, w: 100, h: 14 },
    summary: "Section heading 'More' is too generic to describe its content.",
    ai: "The settings panel below this heading covers data export and account deletion, but the heading just says 'More'. This isn't a hard failure, but descriptive headings materially help screen reader users who scan a page by heading list.",
    before: `<h2 class="section-title">More</h2>`,
    after: `<h2 class="section-title">Data &amp; account</h2>`,
  },
  {
    id: "f8", scanId: "s3", severity: "serious", level: "A", sc: "1.3.1",
    scName: "Info and Relationships", page: "docs.northwind.app/guide", pageType: "article",
    element: "div.step-list", status: "in-progress", assignee: "t3",
    highlight: { x: 30, y: 90, w: 200, h: 60 },
    summary: "Numbered setup steps are built from styled <div>s, not a list.",
    ai: "Each 'step' is a <div> with a manually typed number ('1.', '2.'...). Without real list markup, screen readers can't announce 'list of 5 items' or let users jump between steps, so the sequence is much harder to follow non-visually.",
    before: `<div class="step-list">\n  <div>1. Create a project</div>\n  <div>2. Add your first page</div>\n</div>`,
    after: `<ol class="step-list">\n  <li>Create a project</li>\n  <li>Add your first page</li>\n</ol>`,
  },
  {
    id: "f9", scanId: "s3", severity: "minor", level: "AA", sc: "2.4.4",
    scName: "Link Purpose (In Context)", page: "docs.northwind.app/guide", pageType: "article",
    element: "a.inline-link", status: "open", assignee: "unassigned",
    highlight: { x: 60, y: 160, w: 50, h: 8 },
    summary: "Several links in the body text just say 'click here'.",
    ai: "Screen reader users often navigate by pulling up a list of links out of context. Three links on this page read 'click here', which gives that list no useful information about where each one goes.",
    before: `Read more about permissions <a href="/perms">click here</a>.`,
    after: `Read more about <a href="/perms">how permissions work</a>.`,
  },
  {
    id: "f10", scanId: "s3", severity: "moderate", level: "A", sc: "2.1.1",
    scName: "Keyboard", page: "docs.northwind.app/guide", pageType: "article",
    element: "div.copy-code-btn", status: "open", assignee: "t4",
    highlight: { x: 250, y: 92, w: 50, h: 16 },
    summary: "'Copy code' control only responds to mouse clicks.",
    ai: "The copy-to-clipboard control is a <div> with an onclick handler and no tabindex, so keyboard-only users can't reach or activate it at all — the code block is effectively uncopyable for them.",
    before: `<div class="copy-code-btn" onclick="copy()">Copy</div>`,
    after: `<button class="copy-code-btn" onClick={copy}>Copy</button>`,
  },
];

const REGRESSION_RUNS = [
  { id: "r1", date: "2026-09-10", trigger: "Scheduled (weekly)", delta: +2, newIssues: 1, fixedIssues: 3 },
  { id: "r2", date: "2026-09-03", trigger: "Scheduled (weekly)", delta: -4, newIssues: 5, fixedIssues: 1 },
  { id: "r3", date: "2026-08-27", trigger: "Manual re-scan", delta: +6, newIssues: 0, fixedIssues: 6 },
  { id: "r4", date: "2026-08-20", trigger: "Scheduled (weekly)", delta: +1, newIssues: 2, fixedIssues: 2 },
];

/* ---------------------------------------------------------------------- */
/*  Small building blocks                                                  */
/* ---------------------------------------------------------------------- */

function SeverityBadge({ severity }) {
  const s = SEVERITY[severity];
  const Icon = s.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 12.5, fontWeight: 500, color: s.color,
    }}>
      <Icon size={13} strokeWidth={2.4} />
      {s.label}
    </span>
  );
}

function ScorePill({ score }) {
  const color = score >= 80 ? T.pass : score >= 60 ? T.moderate : T.critical;
  return (
    <div style={{
      display: "inline-flex", alignItems: "baseline", gap: 3,
      fontFamily: "'IBM Plex Mono', monospace", color,
    }}>
      <span style={{ fontSize: 26, fontWeight: 600, lineHeight: 1 }}>{score}</span>
      <span style={{ fontSize: 12, color: T.faint }}>/100</span>
    </div>
  );
}

/** Procedural "screenshot" of the scanned page with the violating element outlined. */
function ScreenshotPreview({ pageType, highlight, color, small }) {
  const w = 320, h = 200;
  const chromeH = 18;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: "block", borderRadius: small ? 6 : 8 }}>
      <rect width={w} height={h} fill="#F3F4F1" />
      {/* browser chrome */}
      <rect width={w} height={chromeH} fill="#DCDEDA" />
      <circle cx="10" cy={chromeH / 2} r="3" fill="#E7908C" />
      <circle cx="20" cy={chromeH / 2} r="3" fill="#E8CB88" />
      <circle cx="30" cy={chromeH / 2} r="3" fill="#94C79A" />
      <rect x="46" y="5" width={w - 60} height="8" rx="4" fill="#F3F4F1" />

      {pageType === "marketing" && (
        <>
          <rect x="0" y={chromeH} width={w} height="26" fill="#FFFFFF" />
          <circle cx="16" cy={chromeH + 13} r="5" fill="#2F7A3C" />
          <rect x="150" y={chromeH + 9} width="34" height="7" rx="2" fill="#C7CCC4" />
          <rect x="196" y={chromeH + 9} width="34" height="7" rx="2" fill="#C7CCC4" />
          <rect x="242" y={chromeH + 9} width="34" height="7" rx="2" fill="#C7CCC4" />
          <rect x="0" y={chromeH + 26} width={w} height="80" fill="#EEF3EA" />
          <rect x="26" y={chromeH + 44} width="120" height="44" rx="4" fill="#D7E4D0" />
          <rect x="160" y={chromeH + 48} width="130" height="10" rx="2" fill="#8B9186" />
          <rect x="160" y={chromeH + 64} width="100" height="7" rx="2" fill="#ACB2A6" />
          <rect x="150" y="92" width="90" height="22" rx="4" fill="#8FE054" />
          <rect x="24" y="150" width="80" height="34" rx="3" fill="#FFFFFF" stroke="#DEE1D9" />
          <rect x="120" y="150" width="80" height="34" rx="3" fill="#FFFFFF" stroke="#DEE1D9" />
          <rect x="216" y="150" width="80" height="34" rx="3" fill="#FFFFFF" stroke="#DEE1D9" />
        </>
      )}

      {pageType === "form" && (
        <>
          <rect x="0" y={chromeH} width={w} height="22" fill="#FFFFFF" />
          <rect x="16" y={chromeH + 7} width="60" height="8" rx="2" fill="#8B9186" />
          <rect x="30" y="30" width="100" height="14" rx="2" fill="#3A3F38" opacity="0.85" />
          <rect x="40" y="70" width="160" height="10" rx="2" fill="#B9BFB2" />
          <rect x="40" y="82" width="230" height="18" rx="3" fill="#FFFFFF" stroke="#DEE1D9" />
          <rect x="40" y="92" width="130" height="10" rx="2" fill="#ACB2A6" />
          <rect x="40" y="118" width="150" height="10" rx="2" fill="#8B9186" />
          <rect x="250" y="120" width="40" height="16" rx="8" fill="#C4CABC" />
          <circle cx="258" cy="128" r="6" fill="#FFFFFF" />
          <rect x="40" y="160" width="90" height="24" rx="4" fill="#2F7A3C" />
        </>
      )}

      {pageType === "article" && (
        <>
          <rect x="0" y={chromeH} width={w} height="20" fill="#FFFFFF" />
          <rect x="30" y="34" width="150" height="12" rx="2" fill="#3A3F38" opacity="0.85" />
          <rect x="30" y="56" width="200" height="7" rx="2" fill="#B9BFB2" />
          <rect x="30" y="68" width="180" height="7" rx="2" fill="#B9BFB2" />
          <rect x="30" y="90" width="150" height="9" rx="2" fill="#8B9186" />
          <rect x="30" y="106" width="190" height="7" rx="2" fill="#C7CCC4" />
          <rect x="30" y="118" width="190" height="7" rx="2" fill="#C7CCC4" />
          <rect x="30" y="130" width="190" height="7" rx="2" fill="#C7CCC4" />
          <rect x="30" y="142" width="190" height="7" rx="2" fill="#C7CCC4" />
          <rect x="250" y="90" width="50" height="16" rx="3" fill="#E9EBE5" stroke="#D3D7CC" />
          <rect x="60" y="160" width="50" height="8" rx="2" fill="#5B7FA6" />
        </>
      )}

      {highlight && (
        <rect
          x={highlight.x} y={highlight.y + chromeH - 18 > h ? highlight.y : highlight.y}
          width={highlight.w} height={highlight.h}
          fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="4 3" rx="3"
        />
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/*  Views                                                                   */
/* ---------------------------------------------------------------------- */

function DashboardView({ findings, scans }) {
  const counts = useMemo(() => {
    const c = { critical: 0, serious: 0, moderate: 0, minor: 0 };
    findings.forEach((f) => { c[f.severity]++; });
    return c;
  }, [findings]);

  const barData = Object.keys(SEVERITY).map((k) => ({ name: SEVERITY[k].label, value: counts[k], color: SEVERITY[k].color }));
  const openCount = findings.filter((f) => f.status !== "resolved").length;
  const avgScore = Math.round(scans.reduce((a, s) => a + s.score, 0) / scans.length);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard label="Average site score" value={<ScorePill score={avgScore} />} />
        <StatCard label="Open findings" value={openCount} accent={T.critical} />
        <StatCard label="Pages scanned" value={scans.length} accent={T.accent} />
        <StatCard label="Next regression scan" value="Sun, 06:00" sub="weekly · 3 pages" accent={T.dim} small />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14, marginBottom: 24 }}>
        <Panel title="Score history" subtitle="Composite accessibility score across all monitored pages">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={HISTORY} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={T.borderSoft} vertical={false} />
              <XAxis dataKey="date" stroke={T.faint} tick={{ fontSize: 11, fill: T.faint }} axisLine={{ stroke: T.border }} tickLine={false} />
              <YAxis domain={[40, 100]} stroke={T.faint} tick={{ fontSize: 11, fill: T.faint }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: T.raised, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: T.text }} />
              <Line type="monotone" dataKey="score" stroke={T.accent} strokeWidth={2.5} dot={{ r: 3, fill: T.accent }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Open findings by severity">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid stroke={T.borderSoft} vertical={false} />
              <XAxis dataKey="name" stroke={T.faint} tick={{ fontSize: 11, fill: T.faint }} axisLine={{ stroke: T.border }} tickLine={false} />
              <YAxis stroke={T.faint} tick={{ fontSize: 11, fill: T.faint }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: T.raised, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: T.text }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Recent scans">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: T.faint, fontSize: 12 }}>
              <th style={{ fontWeight: 500, paddingBottom: 8 }}>Page</th>
              <th style={{ fontWeight: 500, paddingBottom: 8 }}>Scanned</th>
              <th style={{ fontWeight: 500, paddingBottom: 8 }}>Score</th>
              <th style={{ fontWeight: 500, paddingBottom: 8 }}>Findings</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((s) => {
              const fCount = findings.filter((f) => f.scanId === s.id).length;
              return (
                <tr key={s.id} style={{ borderTop: `1px solid ${T.borderSoft}` }}>
                  <td style={{ padding: "10px 0", fontSize: 13.5, color: T.text, fontFamily: "'IBM Plex Mono', monospace" }}>{s.url}</td>
                  <td style={{ padding: "10px 0", fontSize: 13, color: T.dim }}>{s.date}</td>
                  <td style={{ padding: "10px 0" }}><ScorePillSmall score={s.score} /></td>
                  <td style={{ padding: "10px 0", fontSize: 13, color: T.dim }}>{fCount} open</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function ScorePillSmall({ score }) {
  const color = score >= 80 ? T.pass : score >= 60 ? T.moderate : T.critical;
  return <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 600, color }}>{score}</span>;
}

function StatCard({ label, value, sub, accent, small }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 18px" }}>
      <div style={{ fontSize: 12, color: T.faint, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: small ? 18 : 22, fontWeight: 600, color: accent || T.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: T.faint, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Panel({ title, subtitle, children, right }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: T.faint, marginTop: 2 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

/* ---- Findings view ---- */

function FindingsView({ findings, setFindings, filters, setFilters }) {
  const [expanded, setExpanded] = useState(findings[0]?.id || null);
  const [copiedId, setCopiedId] = useState(null);

  const filtered = findings.filter((f) => {
    if (filters.severity.length && !filters.severity.includes(f.severity)) return false;
    if (filters.status !== "all" && f.status !== filters.status) return false;
    if (filters.page !== "all" && f.page !== filters.page) return false;
    if (filters.query && !(`${f.summary} ${f.sc} ${f.element}`.toLowerCase().includes(filters.query.toLowerCase()))) return false;
    return true;
  });

  const pages = [...new Set(findings.map((f) => f.page))];

  const toggleSeverity = (sev) => {
    setFilters((f) => ({
      ...f,
      severity: f.severity.includes(sev) ? f.severity.filter((s) => s !== sev) : [...f.severity, sev],
    }));
  };

  const updateFinding = (id, patch) => {
    setFindings((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const copyCode = (id, text) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) { /* clipboard unavailable */ }
  };

  return (
    <div>
      <div style={{
        background: T.accentDim, border: `1px solid ${T.accent}55`, borderRadius: 10,
        padding: "11px 16px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 18,
      }}>
        <Sparkles size={16} color={T.accent} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12.5, color: "#D3F5EF", lineHeight: 1.5 }}>
          AI explanations and code suggestions below are drafts to speed up review — they are not a guarantee of WCAG
          conformance. A person should verify each fix, ideally with real assistive-technology testing, before marking it resolved.
        </div>
      </div>

      {/* filter bar */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center",
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 16,
      }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={14} color={T.faint} style={{ position: "absolute", left: 10, top: 9 }} />
          <input
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            placeholder="Search findings…"
            style={{
              width: "100%", background: T.raised, border: `1px solid ${T.border}`, borderRadius: 7,
              padding: "7px 10px 7px 30px", color: T.text, fontSize: 13, outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {Object.keys(SEVERITY).map((k) => {
            const active = filters.severity.includes(k);
            return (
              <button
                key={k}
                onClick={() => toggleSeverity(k)}
                style={{
                  display: "flex", alignItems: "center", gap: 5, fontSize: 12,
                  padding: "6px 10px", borderRadius: 7, cursor: "pointer",
                  border: `1px solid ${active ? SEVERITY[k].color : T.border}`,
                  background: active ? `${SEVERITY[k].color}1A` : "transparent",
                  color: active ? SEVERITY[k].color : T.dim,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: 99, background: SEVERITY[k].color }} />
                {SEVERITY[k].label}
              </button>
            );
          })}
        </div>

        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          style={selectStyle}
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={filters.page}
          onChange={(e) => setFilters((f) => ({ ...f, page: e.target.value }))}
          style={selectStyle}
        >
          <option value="all">All pages</option>
          {pages.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <div style={{ fontSize: 12, color: T.faint, marginLeft: "auto" }}>{filtered.length} of {findings.length}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((f) => {
          const isOpen = expanded === f.id;
          const sev = SEVERITY[f.severity];
          return (
            <div key={f.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
              <button
                onClick={() => setExpanded(isOpen ? null : f.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "13px 16px",
                  background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                }}
              >
                {isOpen ? <ChevronDown size={16} color={T.faint} /> : <ChevronRight size={16} color={T.faint} />}
                <div style={{ width: 54, height: 34, borderRadius: 6, overflow: "hidden", flexShrink: 0, border: `1px solid ${T.border}` }}>
                  <ScreenshotPreview pageType={f.pageType} highlight={f.highlight} color={sev.color} small />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: T.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {f.summary}
                  </div>
                  <div style={{ fontSize: 12, color: T.faint, marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>
                    {f.sc} · {f.scName} · WCAG {f.level}
                  </div>
                </div>
                <SeverityBadge severity={f.severity} />
                <StatusTag status={f.status} />
              </button>

              {isOpen && (
                <div style={{ padding: "0 16px 18px 16px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 18 }}>
                  <div>
                    <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
                      <ScreenshotPreview pageType={f.pageType} highlight={f.highlight} color={sev.color} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.faint, marginTop: 6 }}>
                      <Camera size={12} /> Representative capture from last scan · {f.page}
                    </div>
                    <div style={{ fontSize: 12, color: T.dim, marginTop: 10, fontFamily: "'IBM Plex Mono', monospace" }}>{f.element}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.6, marginBottom: 14 }}>{f.ai}</div>

                    <div style={{ fontSize: 11.5, color: T.faint, marginBottom: 6, textTransform: "none" }}>Suggested fix</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                      <CodeBlock label="Before" code={f.before} />
                      <CodeBlock
                        label="After (AI draft)"
                        code={f.after}
                        accent
                        onCopy={() => copyCode(f.id, f.after)}
                        copied={copiedId === f.id}
                      />
                    </div>

                    <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: 11, color: T.faint }}>Assignee</span>
                        <select
                          value={f.assignee}
                          onChange={(e) => updateFinding(f.id, { assignee: e.target.value })}
                          style={selectStyle}
                        >
                          {TEAM.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: 11, color: T.faint }}>Status</span>
                        <select
                          value={f.status}
                          onChange={(e) => updateFinding(f.id, { status: e.target.value })}
                          style={selectStyle}
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: T.faint, fontSize: 13 }}>
            No findings match these filters.
          </div>
        )}
      </div>
    </div>
  );
}

function CodeBlock({ label, code, accent, onCopy, copied }) {
  return (
    <div style={{
      background: T.raised, border: `1px solid ${accent ? T.accent + "55" : T.border}`, borderRadius: 8, overflow: "hidden",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "6px 10px", borderBottom: `1px solid ${T.border}`, fontSize: 11, color: accent ? T.accent : T.faint,
      }}>
        {label}
        {onCopy && (
          <button onClick={onCopy} style={{ background: "transparent", border: "none", cursor: "pointer", color: copied ? T.pass : T.faint, display: "flex", alignItems: "center", gap: 4 }}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <pre style={{
        margin: 0, padding: "10px 12px", fontSize: 11.5, lineHeight: 1.6, color: T.text,
        fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>{code}</pre>
    </div>
  );
}

function StatusTag({ status }) {
  const map = {
    open: { label: "Open", color: T.dim },
    "in-progress": { label: "In progress", color: T.minor },
    resolved: { label: "Resolved", color: T.pass },
  };
  const s = map[status];
  return (
    <span style={{
      fontSize: 11.5, color: s.color, border: `1px solid ${s.color}55`, borderRadius: 99,
      padding: "3px 9px", flexShrink: 0,
    }}>{s.label}</span>
  );
}

const selectStyle = {
  background: T.raised, border: `1px solid ${T.border}`, borderRadius: 7,
  padding: "6px 8px", color: T.text, fontSize: 12.5, outline: "none",
};

/* ---- Team view ---- */

function TeamView({ findings }) {
  return (
    <Panel title="Team workload" subtitle="Open findings assigned per person">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TEAM.filter((m) => m.id !== "unassigned").map((m) => {
          const open = findings.filter((f) => f.assignee === m.id && f.status !== "resolved");
          const resolved = findings.filter((f) => f.assignee === m.id && f.status === "resolved");
          return (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: `1px solid ${T.borderSoft}` }}>
              <div style={{
                width: 34, height: 34, borderRadius: 99, background: m.color, color: "#0E1116",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>{m.name.split(" ").map((n) => n[0]).join("")}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: T.text, fontWeight: 500 }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: T.faint }}>{m.role}</div>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12.5 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: T.critical, fontWeight: 600 }}>{open.length}</div>
                  <div style={{ color: T.faint, fontSize: 10.5 }}>open</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: T.pass, fontWeight: 600 }}>{resolved.length}</div>
                  <div style={{ color: T.faint, fontSize: 10.5 }}>resolved</div>
                </div>
              </div>
            </div>
          );
        })}
        {(() => {
          const un = findings.filter((f) => f.assignee === "unassigned" && f.status !== "resolved");
          return un.length > 0 && (
            <div style={{ padding: "10px 0", borderTop: `1px solid ${T.borderSoft}`, fontSize: 12.5, color: T.faint }}>
              {un.length} open finding{un.length > 1 ? "s" : ""} still unassigned
            </div>
          );
        })()}
      </div>
    </Panel>
  );
}

/* ---- Scans & regression view ---- */

function ScansView({ scans, autoScan, setAutoScan, onNewScan, crawling }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel title="Run a new audit">
        <form onSubmit={onNewScan} style={{ display: "flex", gap: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Globe size={14} color={T.faint} style={{ position: "absolute", left: 10, top: 10 }} />
            <input
              name="url"
              placeholder="https://example.com/page-to-audit"
              style={{
                width: "100%", background: T.raised, border: `1px solid ${T.border}`, borderRadius: 7,
                padding: "8px 10px 8px 30px", color: T.text, fontSize: 13, outline: "none",
              }}
            />
          </div>
          <button type="submit" disabled={crawling} style={{
            display: "flex", alignItems: "center", gap: 6, background: T.accent, color: "#0B1512",
            border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 13, fontWeight: 600,
            cursor: crawling ? "default" : "pointer", opacity: crawling ? 0.7 : 1,
          }}>
            {crawling ? <RefreshCw size={14} className="spin" /> : <PlusCircle size={14} />}
            {crawling ? "Crawling…" : "Run audit"}
          </button>
        </form>
        <div style={{ fontSize: 11.5, color: T.faint, marginTop: 8 }}>
          The crawler renders the page in a headless browser, runs automated WCAG 2.2 checks, and captures a screenshot for each finding.
        </div>
      </Panel>

      <Panel
        title="Automated regression scans"
        subtitle="Re-run audits on a schedule so fixes don't silently regress"
        right={
          <button
            onClick={() => setAutoScan((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 12.5, color: autoScan ? T.accent : T.faint }}>{autoScan ? "Weekly · on" : "Off"}</span>
            <span style={{
              width: 34, height: 19, borderRadius: 99, background: autoScan ? T.accent : T.border,
              position: "relative", transition: "background 0.15s",
            }}>
              <span style={{
                position: "absolute", top: 2, left: autoScan ? 17 : 2, width: 15, height: 15, borderRadius: 99,
                background: "#0B1512", transition: "left 0.15s",
              }} />
            </span>
          </button>
        }
      >
        <div style={{ fontSize: 12, color: T.faint, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={13} /> {autoScan ? "Next run: Sunday 06:00 · 3 pages monitored" : "Automated scans are paused"}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: T.faint, fontSize: 11.5 }}>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>Run</th>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>Trigger</th>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>Score change</th>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>New issues</th>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>Fixed</th>
            </tr>
          </thead>
          <tbody>
            {REGRESSION_RUNS.map((r) => (
              <tr key={r.id} style={{ borderTop: `1px solid ${T.borderSoft}` }}>
                <td style={{ padding: "8px 0", fontSize: 12.5, color: T.text }}>{r.date}</td>
                <td style={{ padding: "8px 0", fontSize: 12.5, color: T.dim }}>{r.trigger}</td>
                <td style={{ padding: "8px 0", fontSize: 12.5, color: r.delta >= 0 ? T.pass : T.critical, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {r.delta >= 0 ? `+${r.delta}` : r.delta}
                </td>
                <td style={{ padding: "8px 0", fontSize: 12.5, color: r.newIssues > 0 ? T.serious : T.faint }}>{r.newIssues}</td>
                <td style={{ padding: "8px 0", fontSize: 12.5, color: T.pass }}>{r.fixedIssues}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Monitored pages">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {scans.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderTop: `1px solid ${T.borderSoft}` }}>
              <div style={{ width: 40, height: 26, borderRadius: 4, overflow: "hidden", border: `1px solid ${T.border}`, flexShrink: 0 }}>
                <ScreenshotPreview pageType={s.pageType} small />
              </div>
              <div style={{ fontSize: 13, color: T.text, fontFamily: "'IBM Plex Mono', monospace", flex: 1 }}>{s.url}</div>
              <div style={{ fontSize: 12, color: T.faint }}>last scan {s.date}</div>
              <ScorePillSmall score={s.score} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---- Reports & exports view ---- */

function ReportsView({ findings, scans }) {
  const [exported, setExported] = useState(false);

  const exportCSV = () => {
    const header = ["id", "page", "severity", "wcag_sc", "criterion", "level", "status", "assignee", "summary"];
    const rows = findings.map((f) => [
      f.id, f.page, f.severity, f.sc, f.scName, f.level, f.status,
      TEAM.find((m) => m.id === f.assignee)?.name || "Unassigned",
      f.summary.replace(/,/g, ";"),
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    try {
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "accessibility-findings.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExported(true);
      setTimeout(() => setExported(false), 1800);
    } catch (e) { /* download blocked */ }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel title="Export findings" subtitle="Share a snapshot of current findings with stakeholders or ticketing tools">
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={exportCSV} style={exportBtnStyle(true)}>
            <FileDown size={14} /> {exported ? "Downloaded" : "Export CSV"}
          </button>
          <button onClick={() => window.print()} style={exportBtnStyle(false)}>
            <FileDown size={14} /> Export summary (PDF)
          </button>
        </div>
      </Panel>

      <Panel title="Score by page">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: T.faint, fontSize: 11.5 }}>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>Page</th>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>Score</th>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>Critical</th>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>Serious</th>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>Moderate</th>
              <th style={{ fontWeight: 500, paddingBottom: 6 }}>Minor</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((s) => {
              const pf = findings.filter((f) => f.scanId === s.id);
              const count = (sev) => pf.filter((f) => f.severity === sev).length;
              return (
                <tr key={s.id} style={{ borderTop: `1px solid ${T.borderSoft}` }}>
                  <td style={{ padding: "8px 0", fontSize: 12.5, color: T.text, fontFamily: "'IBM Plex Mono', monospace" }}>{s.url}</td>
                  <td style={{ padding: "8px 0" }}><ScorePillSmall score={s.score} /></td>
                  <td style={{ padding: "8px 0", fontSize: 12.5, color: T.critical }}>{count("critical")}</td>
                  <td style={{ padding: "8px 0", fontSize: 12.5, color: T.serious }}>{count("serious")}</td>
                  <td style={{ padding: "8px 0", fontSize: 12.5, color: T.moderate }}>{count("moderate")}</td>
                  <td style={{ padding: "8px 0", fontSize: 12.5, color: T.minor }}>{count("minor")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

const exportBtnStyle = (primary) => ({
  display: "flex", alignItems: "center", gap: 7,
  background: primary ? T.accent : "transparent",
  color: primary ? "#0B1512" : T.text,
  border: primary ? "none" : `1px solid ${T.border}`,
  borderRadius: 7, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
});

/* ---------------------------------------------------------------------- */
/*  App shell                                                              */
/* ---------------------------------------------------------------------- */

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "findings", label: "Findings", icon: ListChecks },
  { id: "scans", label: "Scans & regression", icon: RadarIcon },
  { id: "team", label: "Team", icon: Users },
  { id: "reports", label: "Reports & exports", icon: FileDown },
];

export default function App() {
  const [view, setView] = useState("dashboard");
  const [findings, setFindings] = useState(FINDINGS);
  const [scans, setScans] = useState(SCANS);
  const [autoScan, setAutoScan] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ severity: [], status: "all", page: "all", query: "" });

  const handleNewScan = (e) => {
    e.preventDefault();
    const url = e.target.elements.url.value.trim();
    if (!url || crawling) return;
    setCrawling(true);
    setTimeout(() => {
      const id = `s${scans.length + 1}`;
      setScans((prev) => [{ id, url, date: "2026-09-12", score: 70, pageType: "marketing" }, ...prev]);
      setCrawling(false);
      setToast(`Scan complete — ${url}`);
      setTimeout(() => setToast(null), 2600);
      e.target.reset();
    }, 1400);
  };

  return (
    <div style={{
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif", background: T.bg, color: T.text,
      minHeight: "100vh", display: "flex",
    }}>
      <style>{FONTS}{`
        * { box-sizing: border-box; }
        input::placeholder { color: ${T.faint}; }
        select option { background: ${T.raised}; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 6px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        a { color: inherit; }
        button:focus-visible, input:focus-visible, select:focus-visible {
          outline: 2px solid ${T.accent}; outline-offset: 1px;
        }
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${T.border}`, padding: "20px 14px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 6px", marginBottom: 26 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7, background: T.accent, display: "flex",
            alignItems: "center", justifyContent: "center", color: "#0B1512", flexShrink: 0,
          }}>
            <RadarIcon size={15} strokeWidth={2.4} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>Beacon<div style={{ fontSize: 10.5, color: T.faint, fontWeight: 400 }}>Accessibility audits</div></div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = view === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 7,
                  background: active ? T.raised : "transparent", border: "none", cursor: "pointer",
                  color: active ? T.text : T.dim, fontSize: 13, textAlign: "left",
                  borderLeft: active ? `2px solid ${T.accent}` : "2px solid transparent",
                }}
              >
                <Icon size={15} strokeWidth={2.1} />
                {n.label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${T.borderSoft}` }}>
          <div style={{ fontSize: 11, color: T.faint, lineHeight: 1.5 }}>
            Automated checks cover a subset of WCAG success criteria. Manual review is still required for full conformance.
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "22px 28px", maxWidth: 1180, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 600, margin: 0 }}>{NAV.find((n) => n.id === view)?.label}</h1>
          </div>
        </div>

        {view === "dashboard" && <DashboardView findings={findings} scans={scans} />}
        {view === "findings" && <FindingsView findings={findings} setFindings={setFindings} filters={filters} setFilters={setFilters} />}
        {view === "scans" && <ScansView scans={scans} autoScan={autoScan} setAutoScan={setAutoScan} onNewScan={handleNewScan} crawling={crawling} />}
        {view === "team" && <TeamView findings={findings} />}
        {view === "reports" && <ReportsView findings={findings} scans={scans} />}

        {toast && (
          <div style={{
            position: "fixed", bottom: 24, right: 28, background: T.raised, border: `1px solid ${T.accent}55`,
            borderRadius: 8, padding: "10px 16px", fontSize: 12.5, color: T.text, display: "flex", alignItems: "center", gap: 8,
          }}>
            <Check size={14} color={T.accent} /> {toast}
          </div>
        )}
      </main>
    </div>
  );
}
