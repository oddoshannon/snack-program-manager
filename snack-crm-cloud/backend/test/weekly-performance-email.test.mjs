import assert from "node:assert/strict";
import test from "node:test";
import {
  formatWeeklyMetricValue,
  weeklyPerformanceEmailPreview
} from "../lib/weekly-performance-email.js";

test("weekly performance preview contains only aggregate approved measures and cannot send", () => {
  const preview = weeklyPerformanceEmailPreview({
    period: { startDate: "2026-08-03", endDate: "2026-08-09" },
    metrics: [
      { metricKey: "organization.children-served", name: "Total Children Served", currentValue: 12, unit: "Count" },
      { metricKey: "clinic.no-show-rate", name: "No-Show Rate", currentValue: 10.5, unit: "Percentage" },
      { metricKey: "clinic.quality-of-life", name: "Quality of Life", currentValue: 99, unit: "Count" }
    ],
    dataQuality: [
      { area: "Clinic", issueCount: 2 },
      { area: "Kitchen", issueCount: 1 }
    ]
  });

  assert.equal(preview.automaticDeliveryEnabled, false);
  assert.equal(preview.recipient, "Not configured");
  assert.equal(preview.dataQualityReviewCount, 3);
  assert.match(preview.text, /Total Children Served: 12/);
  assert.match(preview.text, /No-Show Rate: 10.5%/);
  assert.doesNotMatch(preview.text, /Quality of Life/);
  assert.match(preview.text, /preview only/i);
});

test("weekly performance values use readable count, percentage, and currency formats", () => {
  assert.equal(formatWeeklyMetricValue({ currentValue: 4, unit: "Count" }), "4");
  assert.equal(formatWeeklyMetricValue({ currentValue: 8.25, unit: "Percentage" }), "8.3%");
  assert.equal(formatWeeklyMetricValue({ currentValue: 1250, unit: "Currency" }), "$1,250");
  assert.equal(formatWeeklyMetricValue({ currentValue: null, unit: "Count" }), "Not available");
});
