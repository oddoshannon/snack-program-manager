const addressWordStyles = new Map([
  ["n", "N"], ["ne", "NE"], ["e", "E"], ["se", "SE"],
  ["s", "S"], ["sw", "SW"], ["w", "W"], ["nw", "NW"],
  ["or", "OR"], ["ore", "OR"], ["oregon", "OR"],
  ["st", "St"], ["street", "St"], ["ave", "Ave"], ["avenue", "Ave"],
  ["rd", "Rd"], ["road", "Rd"], ["blvd", "Blvd"], ["boulevard", "Blvd"],
  ["dr", "Dr"], ["drive", "Dr"], ["ln", "Ln"], ["lane", "Ln"],
  ["ct", "Ct"], ["court", "Ct"], ["cir", "Cir"], ["circle", "Cir"],
  ["pkwy", "Pkwy"], ["parkway", "Pkwy"], ["hwy", "Hwy"], ["highway", "Hwy"],
  ["pl", "Pl"], ["place", "Pl"], ["ter", "Ter"], ["terrace", "Ter"],
  ["apt", "Apt"], ["apartment", "Apt"], ["ste", "Suite"], ["suite", "Suite"],
  ["unit", "Unit"], ["po", "PO"], ["box", "Box"], ["mcminnville", "McMinnville"]
]);

function normalizeAddressWord(word) {
  const match = String(word || "").match(/^([^A-Za-z0-9#]*)([A-Za-z0-9#'-]+)([^A-Za-z0-9#]*)$/);
  if (!match) return word;
  const [, leading, body, trailing] = match;
  const key = body.toLowerCase().replace(/\.$/, "");
  if (addressWordStyles.has(key)) return `${leading}${addressWordStyles.get(key)}${trailing}`;
  if (/^\d+(?:st|nd|rd|th)?$/i.test(body) || /^#\w+$/i.test(body) || /^\d{5}(?:-\d{4})?$/.test(body) || /^[A-Z]{2,}$/.test(body)) {
    return `${leading}${body}${trailing}`;
  }
  if (/[A-Z]/.test(body.slice(1)) && /[a-z]/.test(body)) return `${leading}${body}${trailing}`;
  const styled = body.split(/([-'])/).map((part) => {
    if (part === "-" || part === "'") return part;
    return part ? `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}` : part;
  }).join("");
  return `${leading}${styled}${trailing}`;
}

export function normalizeMailingAddress(value) {
  const cleaned = String(value || "").trim()
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ");
  if (!cleaned) return "";
  return cleaned.split(",").map((segment) => segment.trim().split(" ").map(normalizeAddressWord).join(" ")).join(", ");
}
