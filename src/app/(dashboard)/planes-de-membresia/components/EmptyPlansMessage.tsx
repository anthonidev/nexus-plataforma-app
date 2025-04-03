"use client";
import { Button } from "@/components/ui/button";

interface EmptyPlansMessageProps {
  onRefresh: () => void;
}

export default function EmptyPlansMessage({
  onRefresh,
}: EmptyPlansMessageProps) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 p-6 rounded-lg text-center">
      <h3 className="text-lg font-semibold mb-2">No hay planes disponibles</h3>
      <p>
        Actualmente no hay planes de membresía disponibles. Por favor, intenta
        más tarde.
      </p>
      <Button variant="outline" onClick={onRefresh} className="mt-4">
        Verificar nuevamente
      </Button>
    </div>
  );
}
