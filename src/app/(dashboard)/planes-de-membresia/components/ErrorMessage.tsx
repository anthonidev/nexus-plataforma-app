"use client";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  errorMessage: string;
  onRetry: () => void;
}

export default function ErrorMessage({
  errorMessage,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-8">
      <p>Error al cargar los planes: {errorMessage}</p>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
        Reintentar
      </Button>
    </div>
  );
}
