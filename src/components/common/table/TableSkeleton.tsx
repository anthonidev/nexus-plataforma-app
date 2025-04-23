// TableSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function TableSkeleton() {
    return (
        <div className="space-y-4">
            {/* Skeleton para vista de escritorio */}
            <div className="hidden md:block rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <TableHead key={index} className="h-10">
                                        <Skeleton className="h-4 w-24" />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {Array.from({ length: 6 }).map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Skeleton para vista móvil */}
            <div className="md:hidden space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-4 w-10" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-t">
                                <Skeleton className="h-9 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Skeleton para la paginación */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Skeleton className="h-8 w-full sm:w-48" />
                <Skeleton className="h-8 w-full sm:w-48" />
            </div>
        </div>
    );
}