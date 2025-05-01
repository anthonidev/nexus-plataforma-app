import { Bell } from "lucide-react";

export function EmptyNotifications() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/10">
            <div className="bg-muted/20 p-6 rounded-full mb-4">
                <Bell className="h-16 w-16 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">No hay notificaciones</h3>
            <p className="text-muted-foreground text-center max-w-md">
                No se encontraron notificaciones que coincidan con los filtros actuales. Intenta con otros filtros o vuelve a comprobar más tarde.
            </p>
        </div>
    );
}