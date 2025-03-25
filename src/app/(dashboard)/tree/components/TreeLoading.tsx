// src/app/(dashboard)/tree/components/TreeLoading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function TreeLoading() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-1/4 mb-2" />
        <Skeleton className="h-5 w-2/4" />
      </div>
      <div className="h-[600px] relative">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    </div>
  );
}