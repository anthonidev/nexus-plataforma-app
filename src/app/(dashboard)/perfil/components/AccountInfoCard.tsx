import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  User,
  Award,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

interface AccountInfoCardProps {
  isActive: boolean;
  role: {
    id: number;
    code: string;
    name: string;
  };
}

export default function AccountInfoCard({
  isActive,
  role,
}: AccountInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative"
    >
      <div className="flex flex-row justify-between items-start w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">Estado de Cuenta</h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={isActive ? "default" : "destructive"}
                className="px-2 py-0.5"
              >
                {isActive ? "Activa" : "Inactiva"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4 mt-2">
        <div className="flex items-center gap-2 mb-3">
          {isActive ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
          <span className="text-sm font-medium">
            {isActive ? "Cuenta verificada" : "Cuenta pendiente de activación"}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-background/80 dark:bg-gray-800/50 rounded-md">
            <Award className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Rol de Usuario</p>
              <p className="font-medium">{role.name}</p>
            </div>
          </div>

          <div className="flex justify-between text-sm pt-2">
            <span className="text-muted-foreground">Código:</span>
            <span className="font-mono font-medium">{role.code}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ID de rol:</span>
            <span className="font-mono">{role.id}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground">
          Última actualización: {new Date().toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}
