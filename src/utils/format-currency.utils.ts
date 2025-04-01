export function formatCurrency(
  value: string | number,
  currency: string = "PEN"
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}

export function formatDate(
  dateString: string,
  includeTime: boolean = false
): string {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "Fecha inválida";

  if (includeTime) {
    return date.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function truncateText(text: string, maxLength: number = 30): string {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return `${text.substring(0, maxLength)}...`;
}
