import { format } from "date-fns";

interface DateFormatDisplayProps {
    date: string | Date | null;
}

export function DateFormatDisplay({ date }: DateFormatDisplayProps) {
    if (!date) return <span>N/A</span>;

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formattedDate = format(dateObj, "dd/MM/yyyy");
    const formattedTime = format(dateObj, "HH:mm");

    return (
        <div className="flex flex-col">
            <span className="text-sm font-medium">{formattedDate}</span>
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
    );
}