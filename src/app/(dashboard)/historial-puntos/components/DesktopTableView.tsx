// DesktopTableView.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { Info } from "lucide-react";

interface DesktopTableViewProps {
    table: any;
    columns: ColumnDef<any>[];
}

export function DesktopTableView({ table, columns }: DesktopTableViewProps) {
    return (
        <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/30">
                        {table.getHeaderGroups().map((headerGroup: any) => (
                            <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                                {headerGroup.headers.map((header: any) => (
                                    <TableHead key={header.id} className="font-semibold text-sm h-10">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row: any) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="transition-colors hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell: any) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                                        <Info className="h-8 w-8 text-muted-foreground/70 mb-2" />
                                        <p>No se encontraron transacciones</p>
                                        <p className="text-sm mt-1">Intenta ajustar los filtros para ver más resultados</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}