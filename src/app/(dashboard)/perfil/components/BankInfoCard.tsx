import { Button } from "@/components/ui/button";
import { Edit, CreditCard } from "lucide-react";
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
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {hasInfo ? (
        <div className="grid grid-cols-1 gap-2 mt-2">
          <div className="flex items-start gap-2">
            <span className="text-xs text-muted-foreground w-24">
              Nº Cuenta:
            </span>
            <span className="text-xs font-medium">
              {maskAccountNumber(bankInfo?.accountNumber)}
            </span>
          </div>

          {bankInfo?.cci && (
            <div className="flex items-start gap-2">
              <span className="text-xs text-muted-foreground w-24">CCI:</span>
              <span className="text-xs font-medium">
                {maskAccountNumber(bankInfo.cci)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 p-2 rounded-md">
            No has registrado información bancaria. Esto es necesario para
            recibir pagos.
          </div>
        </div>
      )}
    </motion.div>
  );
}
