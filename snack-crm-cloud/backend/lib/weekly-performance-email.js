const weeklyPerformanceMetricKeys = Object.freeze([
  "organization.children-served",
  "organization.program-engagements",
  "clinic.appointments-delivered",
  "clinic.referrals-received",
  "clinic.no-show-rate",
  "cooking.classes-delivered",
  "community.events-completed",
  "community.families-reached"
]);

function escapeWeeklyEmailHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatWeeklyMetricValue(metric = {}) {
  const value = metric.currentValue;
  if (value === null || value === undefined || value === "") return "Not available";
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  if (metric.unit === "Percentage") return `${number.toFixed(1).replace(/\.0$/, "")}%`;
  if (["Currency", "Dollars"].includes(metric.unit)) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(number);
  }
  return Number.isInteger(number) ? String(number) : number.toFixed(1).replace(/\.0$/, "");
}

function weeklyPerformanceEmailPreview({ period = {}, metrics = [], dataQuality = [] } = {}) {
  const selectedMetrics = weeklyPerformanceMetricKeys
    .map((metricKey) => metrics.find((metric) => metric.metricKey === metricKey))
    .filter(Boolean)
    .map((metric) => ({
      metricKey: metric.metricKey,
      name: metric.name,
      value: formatWeeklyMetricValue(metric),
      targetStatus: metric.targetStatus || ""
    }));
  const reviewCount = dataQuality.reduce((total, item) => total + Math.max(0, Number(item.issueCount) || 0), 0);
  const periodLabel = period.startDate && period.endDate
    ? `${period.startDate} through ${period.endDate}`
    : "the selected reporting period";
  const subject = `SNACK weekly performance preview: ${periodLabel}`;
  const metricLines = selectedMetrics.length
    ? selectedMetrics.map((metric) => `• ${metric.name}: ${metric.value}`)
    : ["• No approved summary measures are available for this period."];
  const text = [
    "SNACK Program weekly performance preview",
    "",
    `Reporting period: ${periodLabel}`,
    "",
    ...metricLines,
    "",
    `Data-quality items to review: ${reviewCount}`,
    "",
    "This is a preview only. Weekly delivery is not scheduled or enabled."
  ].join("\n");
  const listHtml = selectedMetrics.length
    ? selectedMetrics.map((metric) => `<li><strong>${escapeWeeklyEmailHtml(metric.name)}:</strong> ${escapeWeeklyEmailHtml(metric.value)}</li>`).join("")
    : "<li>No approved summary measures are available for this period.</li>";
  const html = `<h1>SNACK Program weekly performance preview</h1><p><strong>Reporting period:</strong> ${escapeWeeklyEmailHtml(periodLabel)}</p><ul>${listHtml}</ul><p><strong>Data-quality items to review:</strong> ${reviewCount}</p><p><em>This is a preview only. Weekly delivery is not scheduled or enabled.</em></p>`;
  return {
    subject,
    text,
    html,
    period: { startDate: period.startDate || "", endDate: period.endDate || "" },
    metrics: selectedMetrics,
    dataQualityReviewCount: reviewCount,
    automaticDeliveryEnabled: false,
    recipient: "Not configured"
  };
}

export {
  formatWeeklyMetricValue,
  weeklyPerformanceEmailPreview,
  weeklyPerformanceMetricKeys
};
