"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface WithdrawalsHeaderProps {
  onRefresh: () => void;
  onOpenWithdrawalModal: () => void;
  canWithdraw: boolean;
  isLoading: boolean;
}

export default function WithdrawalsHeader({
  onRefresh,
  onOpenWithdrawalModal,
  canWithdraw,
  isLoading,
}: WithdrawalsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Retiros</h1>
          <p className="text-muted-foreground mt-1">
            Visualiza tus puntos disponibles y solicita retiros
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Actualizar</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onOpenWithdrawalModal}
            disabled={!canWithdraw || isLoading}
          >
            {/* <Cash className="h-4 w-4 mr-2" /> */}
            <span>Solicitar Retiro</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
