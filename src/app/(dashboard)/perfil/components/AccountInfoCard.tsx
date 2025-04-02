import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User } from "lucide-react";
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
            <h3 className="font-medium text-lg">Cuenta</h3>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? "default" : "destructive"}>
                {isActive ? "Activa" : "Inactiva"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-2">
        <div className="bg-secondary/30 dark:bg-secondary/20 rounded-md p-3 flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Rol de usuario</p>
            <p className="text-sm font-medium">{role.name}</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p className="mb-1">Código de rol: {role.code}</p>
          <p>ID de rol: {role.id}</p>
        </div>
      </div>
    </motion.div>
  );
}
