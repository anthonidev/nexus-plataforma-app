// src/app/(dashboard)/tree/components/TreeLoading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function TreeLoading() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 md:mb-6">
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Fake controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
        <div className="flex-1 hidden md:block"></div>
        <Skeleton className="h-9 w-32" />
      </div>
      
      {/* Main tree container */}
      <div className="flex-1">
        <Skeleton className="h-full w-full rounded-lg" style={{ minHeight: "600px", maxHeight: "calc(100vh - 250px)" }} />
      </div>
    </div>
  );
}