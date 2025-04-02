import { Button } from "@/components/ui/button";
import { Edit, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface BankInfoCardProps {
  bankInfo: {
    bankName?: string;
    accountNumber?: string;
    cci?: string;
  } | null;
  onEdit: () => void;
}

export default function BankInfoCard({ bankInfo, onEdit }: BankInfoCardProps) {
  const hasInfo = bankInfo && bankInfo.bankName && bankInfo.accountNumber;

  const maskAccountNumber = (number?: string) => {
    if (!number) return "";
    return number.length > 8 ? "••••" + number.slice(-4) : number;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative"
    >
      <div className="flex flex-row justify-between items-start w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <CreditCard size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">Datos Bancarios</h3>
            <p className="text-sm text-muted-foreground">
              {hasInfo ? bankInfo?.bankName : "No especificados"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex gap-2 items-center"
        >
          <Edit className="h-4 w-4" />
          <span>Editar</span>
        </Button>
      </div>

      {hasInfo ? (
        <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">
              Información bancaria completa
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-sm text-muted-foreground">Nº Cuenta:</span>
              <span className="text-sm font-medium">
                {maskAccountNumber(bankInfo?.accountNumber)}
              </span>
            </div>

            {bankInfo?.cci && (
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">CCI:</span>
                <span className="text-sm font-medium">
                  {maskAccountNumber(bankInfo.cci)}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-2 items-start">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">
                  Información bancaria pendiente
                </h4>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  No has registrado información bancaria. Esto es necesario para
                  recibir pagos.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="mt-3 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400"
            >
              Agregar datos bancarios
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
