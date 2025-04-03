import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-center">
        <AlertCircle className="mr-2 text-red-500" />
        <p className="text-red-700">{error || "Plan no encontrado"}</p>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="container mx-auto p-6 grid md:grid-cols-2 gap-8">
      <Card className="h-fit">
        <CardHeader>
          <Skeleton className="h-8 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={`product-${index}`}
                  className="flex items-center gap-2"
                >
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={`benefit-${index}`}
                  className="flex items-center gap-2"
                >
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />

            <div className="flex justify-between items-center border-t pt-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>

            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-20" />
            </div>

            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
