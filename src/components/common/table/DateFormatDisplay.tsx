import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatInTimeZone } from 'date-fns-tz';

interface DateFormatDisplayProps {
    date: string | Date | null;
}

export function DateFormatDisplay({ date }: DateFormatDisplayProps) {
    if (!date) return <span>N/A</span>;

    const timeZone = 'America/Lima'; // Reemplaza con tu zona horaria

    const formattedDate = formatInTimeZone(date, timeZone, "dd/MM/yyyy", { locale: es });

    return (
        <div className="flex flex-col">
            <span className="text-sm font-medium">{formattedDate}</span>
        </div>
    );
}