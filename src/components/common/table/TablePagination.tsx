import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaginationState, Updater } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
    pagination: PaginationState;
    pageIndex: number;
    pageCount: number;
    previousPage: () => void;
    nextPage: () => void;
    setPageSize: (updater: Updater<number>) => void
    setPageIndex: (updater: Updater<number>) => void;
    canNextPage: boolean;
    canPreviousPage: boolean;
    totalItems: number;
}

export function TablePagination({
    pageIndex,
    pageCount,
    pagination,
    previousPage,
    nextPage,
    setPageSize,
    canNextPage,
    canPreviousPage,
    totalItems,
    setPageIndex
}: TablePaginationProps) {
    // Hide pagination controls if there's only one page
    if (pageCount <= 1) {
        return (
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    Mostrando {totalItems} registro{totalItems !== 1 ? "s" : ""}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    Mostrar
                </p>
                <Select
                    value={`${pagination.pageSize}`}
                    onValueChange={(value) => {
                        setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue
                            placeholder={pagination.pageSize}
                        />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    de {totalItems} registros
                </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previousPage()}
                        disabled={canPreviousPage}
                        className="h-8 px-2 text-muted-foreground"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                            const pageNumber = pageIndex < 3
                                ? i + 1
                                : pageIndex > pageCount - 3
                                    ? pageCount - 4 + i
                                    : pageIndex - 2 + i;

                            if (pageNumber > pageCount) return null;

                            return (
                                <Button
                                    key={pageNumber}
                                    variant={pageNumber === pageIndex + 1 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPageIndex(pageNumber - 1)}
                                    className={`h-8 w-8 p-0 ${pageNumber === pageIndex + 1
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "text-muted-foreground"
                                        }`}
                                >
                                    {pageNumber}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="sm:hidden flex items-center px-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {pagination.pageIndex + 1} / {pageCount}
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => nextPage()}
                        disabled={canNextPage}
                        className="h-8 px-2 text-muted-foreground"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="hidden lg:block text-sm text-muted-foreground whitespace-nowrap ml-2">
                    Página {pagination.pageIndex + 1} de{" "}
                    {pageCount}
                </div>
            </div>
        </div>
    );
}
