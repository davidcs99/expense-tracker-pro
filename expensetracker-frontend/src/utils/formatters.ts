export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value || 0);
}

export function formatShortDate(value: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function formatLongDate(value: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(value));
}

export function toTitleCase(value: string) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
