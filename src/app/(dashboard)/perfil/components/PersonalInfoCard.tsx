import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";
import { motion } from "framer-motion";

interface PersonalInfoCardProps {
  personalInfo: {
    firstName?: string;
    lastName?: string;
    documentNumber?: string;
    gender?: string;
    birthDate?: Date;
  } | null;
  email: string;
  onEdit: () => void;
}

export default function PersonalInfoCard({
  personalInfo,
  email,
  onEdit,
}: PersonalInfoCardProps) {
  const fullName = personalInfo
    ? `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim()
    : "No especificado";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative"
    >
      <div className="flex flex-row justify-between items-start w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">{fullName}</h3>
            <p className="text-sm text-muted-foreground">{email}</p>
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

      <div className="grid grid-cols-1 gap-2 mt-2">
        {personalInfo?.documentNumber && (
          <div className="flex items-start gap-2">
            <span className="text-xs text-muted-foreground w-24">
              Documento:
            </span>
            <span className="text-xs font-medium">
              {personalInfo.documentNumber}
            </span>
          </div>
        )}

        {personalInfo?.gender && (
          <div className="flex items-start gap-2">
            <span className="text-xs text-muted-foreground w-24">Género:</span>
            <span className="text-xs font-medium">
              {personalInfo.gender === "M"
                ? "Masculino"
                : personalInfo.gender === "F"
                ? "Femenino"
                : personalInfo.gender}
            </span>
          </div>
        )}

        {personalInfo?.birthDate && (
          <div className="flex items-start gap-2">
            <span className="text-xs text-muted-foreground w-24">
              Fecha de nac.:
            </span>
            <span className="text-xs font-medium">
              {new Date(personalInfo.birthDate).toLocaleDateString("es-ES")}
            </span>
          </div>
        )}

        {!personalInfo?.documentNumber &&
          !personalInfo?.gender &&
          !personalInfo?.birthDate && (
            <p className="text-xs text-muted-foreground italic">
              No hay información personal adicional
            </p>
          )}
      </div>
    </motion.div>
  );
}
