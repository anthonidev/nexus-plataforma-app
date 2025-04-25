import { format } from "date-fns";

interface DateFormatDisplayProps {
    date: string | Date | null;
}

export function DateFormatDisplay({ date }: DateFormatDisplayProps) {
    if (!date) return <span>N/A</span>;

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formattedDate = format(dateObj, "dd/MM/yyyy");

    return (
        <div className="flex flex-col">
            <span className="text-sm font-medium">{formattedDate}</span>
        </div>
    );
}