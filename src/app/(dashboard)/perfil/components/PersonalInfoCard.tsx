import { Button } from "@/components/ui/button";
import {
  Edit,
  User,
  Mail,
  Calendar,
  UserRound,
  CreditCard,
} from "lucide-react";
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
      <div className="flex flex-row justify-between items-start w-full mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-xl">{fullName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" />
              Información personal
            </h4>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Nombre completo</p>
                <p className="font-medium">
                  {fullName !== "No especificado" ? fullName : "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Género</p>
                <p className="font-medium">
                  {personalInfo?.gender
                    ? personalInfo.gender === "M"
                      ? "Masculino"
                      : personalInfo.gender === "F"
                      ? "Femenino"
                      : personalInfo.gender
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Fecha de nacimiento
            </h4>
            <p className="font-medium">
              {personalInfo?.birthDate
                ? new Date(personalInfo.birthDate).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "No especificada"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Documento de Identidad
            </h4>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Número de documento
                </p>
                <p className="font-medium">
                  {personalInfo?.documentNumber || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Tipo de documento
                </p>
                <p className="font-medium">DNI</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2 text-primary">
              Estado de cuenta
            </h4>
            <div className="flex items-center justify-between">
              <p>Activo desde</p>
              <p className="font-medium">Enero 2023</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
