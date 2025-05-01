import { format as dateFnsFormat, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

// Define tu zona horaria local (Lima, Perú)
const TIME_ZONE = "America/Lima";

export function format(
  date: string | Date | number | null | undefined,
  formatStr: string
): string {
  const parsedDate = toDate(date);
  const timeZone = "America/Lima";
  if (!parsedDate) {
    return dateFnsFormat(new Date(), formatStr, { locale: es });
  }
  const formattedDate = formatInTimeZone(parsedDate, timeZone, formatStr, {
    locale: es,
  });
  return formattedDate;
}

export function toDate(
  date: string | Date | number | null | undefined
): Date | undefined {
  if (!date) {
    return undefined;
  }

  if (typeof date === "string") {
    return parseISO(date);
  }
  if (typeof date === "number") {
    return new Date(date);
  }
  return date;
}
