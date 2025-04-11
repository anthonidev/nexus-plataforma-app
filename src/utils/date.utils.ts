import { format as dateFnsFormat, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function format(
  date: string | Date | number,
  formatStr: string
): string {
  if (typeof date === "string") {
    return dateFnsFormat(parseISO(date), formatStr, { locale: es });
  }
  if (typeof date === "number") {
    return dateFnsFormat(new Date(date), formatStr, { locale: es });
  }
  if (date instanceof Date) {
    return dateFnsFormat(parseISO(date.toISOString()), formatStr, {
      locale: es,
    });
  }

  return dateFnsFormat(date, formatStr, { locale: es });
}

export function toDate(date: string | Date | number): Date {
  if (typeof date === "string") {
    return parseISO(date);
  }
  if (typeof date === "number") {
    return new Date(date);
  }
  return date;
}
