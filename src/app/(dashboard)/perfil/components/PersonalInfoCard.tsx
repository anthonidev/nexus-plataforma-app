import { Button } from "@/components/ui/button";
import {
  Edit,
  User,
  Mail,
  Calendar,
  UserRound,
  CreditCard,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";

interface PersonalInfoCardProps {
  personalInfo: {
    firstName?: string;
    lastName?: string;
    documentNumber?: string;
    gender?: string;
    birthDate?: Date;
  } | null;
  email: string;
  onUpdatePhoto: (file: File) => void;
  onEdit: () => void;
  photo?: string;
  nickname?: string;
}

export default function PersonalInfoCard({
  personalInfo,
  email,
  onEdit,
  onUpdatePhoto,
  photo,
  nickname,
}: PersonalInfoCardProps) {
  const fullName = personalInfo
    ? `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim()
    : "No especificado";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdatePhoto(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative"
    >
      <div className="flex flex-row justify-between items-start w-full mb-6">
        <div className="flex items-center gap-4">
          <div
            className="relative"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
          >
            <div
              className="h-16 w-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary cursor-pointer"
              onClick={handlePhotoClick}
            >
              {photo ? (
                <Image
                  src={photo}
                  alt="Foto de perfil"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} />
              )}
            </div>

            {/* Botón de editar foto que aparece al hacer hover */}
            {isHoveringAvatar && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer"
                onClick={handlePhotoClick}
              >
                <Upload className="h-5 w-5 text-white" />
              </div>
            )}

            {/* Botón pequeño de editar */}
            <div
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer shadow-md"
              onClick={handlePhotoClick}
            >
              <Edit className="h-3 w-3" />
            </div>

            {/* Input oculto para seleccionar archivo */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-xl">{fullName}</h3>
            {nickname && <p className="text-sm text-primary">@{nickname}</p>}
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
