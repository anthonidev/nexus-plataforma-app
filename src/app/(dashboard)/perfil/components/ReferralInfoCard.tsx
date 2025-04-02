import { Button } from "@/components/ui/button";
import { Copy, Share, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

interface ReferralInfoCardProps {
  referralCode: string;
}

export default function ReferralInfoCard({
  referralCode,
}: ReferralInfoCardProps) {
  const [copying, setCopying] = useState(false);

  const copyToClipboard = () => {
    setCopying(true);
    navigator.clipboard
      .writeText(referralCode)
      .then(() => {
        toast.success("Código copiado al portapapeles", {
          duration: 1500,
        });

        setTimeout(() => setCopying(false), 1500);
      })
      .catch((err) => {
        toast.error("Error al copiar el código", {
          description: "No se pudo copiar el código al portapapeles",
        });
        setCopying(false);
      });
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Mi código de referido",
          text: `Únete usando mi código de referido: ${referralCode}`,
          url: window.location.origin,
        })
        .catch((error) => {
          toast.error("Error al compartir el código", {
            description: "No se pudo compartir el código",
          });
        });
    } else {
      copyToClipboard();
    }
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
            <Gift size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">Código de Referido</h3>
            <p className="text-sm text-muted-foreground">Comparte tu código</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <div className="bg-secondary/30 dark:bg-secondary/20 flex items-center justify-between rounded-md p-3">
          <span className="font-mono font-medium text-primary">
            {referralCode}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            disabled={copying}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={shareReferral}
        >
          <Share className="h-4 w-4" />
          <span>Compartir mi código</span>
        </Button>
      </div>
    </motion.div>
  );
}
