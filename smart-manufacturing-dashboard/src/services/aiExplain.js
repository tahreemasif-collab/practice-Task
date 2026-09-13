// src/services/aiExplain.js
// Generates a natural-language explanation for an anomaly/alert, grounded
// in the most relevant equipment manual passage (a small local
// retrieval-augmented-generation pipeline). The "generation" step is a
// deterministic template engine rather than a live LLM call, but it is
// wired through the same resilient API layer a real model call would use,
// so swapping in `POST /v1/ai/explain` later is a one-line change.

import { searchManuals } from './retrieval';
import { resilientRequest, simulateCall } from './api';

const TYPE_QUERY = {
  oee_drop: 'performance loss reduced OEE',
  defect_spike: 'defect rate quality drop',
  downtime: 'unplanned downtime stop',
  quality_drop: 'quality drop performance degradation'
};

function buildExplanationText(alert, manualHits) {
  const metricSummary = `Availability ${alert.metrics.availability}%, Performance ${alert.metrics.performance}%, Quality ${alert.metrics.quality}%, OEE ${alert.metrics.oee}%.`;

  const likelyCauses = manualHits.length
    ? manualHits.map((h) => h.text)
    : ['No closely matching manual passage was found; recommend manual inspection.'];

  const severityLine =
    alert.severity === 'critical'
      ? 'This is flagged critical because the deviation exceeds normal process variation and is likely to affect downstream yield if unaddressed.'
      : 'This is flagged as a warning-level deviation — worth monitoring, with a moderate chance of escalating if the trend continues.';

  const recommendation = manualHits[0]
    ? `Recommended first action, per ${manualHits[0].title}: ${manualHits[0].text.split(':').slice(1).join(':').trim() || manualHits[0].text}`
    : 'Recommended first action: dispatch a technician to visually inspect the machine and compare against the last known-good baseline.';

  return {
    summary: `${alert.message}. ${metricSummary}`,
    severityLine,
    likelyCauses,
    recommendation,
    citedManual: manualHits[0]?.title || null
  };
}

export async function explainAnomaly(alert) {
  const cacheKey = `ai-explain:${alert.id}`;

  return resilientRequest({
    endpoint: 'ai-explain',
    cacheKey,
    cacheTtlMs: 15 * 60 * 1000,
    retries: 2,
    timeoutMs: 4000,
    fn: async () => {
      const query = `${TYPE_QUERY[alert.type] || alert.type} ${alert.defectType || ''} ${alert.reason || ''}`;
      const retrieval = await searchManuals(query, { manualId: alert.manualId, topK: 2 });
      const manualHits = retrieval.data || [];

      // Simulate the "generation" leg of the pipeline as its own unreliable
      // network hop, independent from retrieval, so failures/backoff are
      // visible on both stages.
      return simulateCall('ai-explain-generate', () => buildExplanationText(alert, manualHits), {
        failRate: 0.15,
        minLatency: 400,
        maxLatency: 1600
      });
    }
  });
}
