"use client";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  Building,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";

import EditBankInfoModal from "./components/modals/EditBankInfoModal";
import EditBillingInfoModal from "./components/modals/EditBillingInfoModal";
import EditContactInfoModal from "./components/modals/EditContactInfoModal";
import EditPersonalInfoModal from "./components/modals/EditPersonalInfoModal";
import PersonalInfoCard from "./components/PersonalInfoCard";
import ContactInfoCard from "./components/ContactInfoCard";
import BankInfoCard from "./components/BankInfoCard";
import BillingInfoCard from "./components/BillingInfoCard";
import ReferralInfoCard from "./components/ReferralInfoCard";
import AccountInfoCard from "./components/AccountInfoCard";
import { useProfile } from "./hooks/useProfile";

export default function ProfilePage() {
  const {
    profile,
    isLoading,
    error,
    isSaving,
    updatePersonal,
    updateContact,
    updateBilling,
    updateBank,
  } = useProfile();

  // Estados para controlar qué modal está abierto
  const [openModal, setOpenModal] = useState<string | null>(null);

  // Manejadores para abrir y cerrar modales
  const handleOpenModal = (modalName: string) => {
    setOpenModal(modalName);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">
          Cargando perfil...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
            Error al cargar el perfil
          </h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">
          No se encontró información del perfil
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Administra tu información personal y configuración de cuenta
        </p>
      </div>

      <BentoGrid>
        {/* Información personal */}
        <BentoGridItem
          title="Información Personal"
          description="Datos básicos de tu perfil"
          header={
            <PersonalInfoCard
              personalInfo={profile.personalInfo}
              email={profile.email}
              onEdit={() => handleOpenModal("personal")}
            />
          }
          icon={<User className="h-4 w-4 text-primary" />}
          className="md:col-span-1"
        />

        {/* Información de contacto */}
        <BentoGridItem
          title="Información de Contacto"
          description="Tus datos de contacto y ubicación"
          header={
            <ContactInfoCard
              contactInfo={profile.contactInfo}
              onEdit={() => handleOpenModal("contact")}
            />
          }
          icon={<Phone className="h-4 w-4 text-primary" />}
          className="md:col-span-1"
        />

        {/* Información bancaria */}
        <BentoGridItem
          title="Información Bancaria"
          description="Tus datos bancarios para recibir pagos"
          header={
            <BankInfoCard
              bankInfo={profile.bankInfo}
              onEdit={() => handleOpenModal("bank")}
            />
          }
          icon={<CreditCard className="h-4 w-4 text-primary" />}
          className="md:col-span-1"
        />

        {/* Información de facturación */}
        <BentoGridItem
          title="Información de Facturación"
          description="Tus datos para facturación"
          header={
            <BillingInfoCard
              billingInfo={profile.billingInfo}
              onEdit={() => handleOpenModal("billing")}
            />
          }
          icon={<FileText className="h-4 w-4 text-primary" />}
          className="md:col-span-1"
        />

        {/* Código de referido */}
        <BentoGridItem
          title="Código de Referido"
          description="Comparte tu código para invitar amigos"
          header={<ReferralInfoCard referralCode={profile.referralCode} />}
          icon={<Mail className="h-4 w-4 text-primary" />}
          className="md:col-span-1"
        />

        {/* Información de la cuenta */}
        <BentoGridItem
          title="Información de la Cuenta"
          description="Detalles de tu cuenta"
          header={
            <AccountInfoCard isActive={profile.isActive} role={profile.role} />
          }
          icon={<Building className="h-4 w-4 text-primary" />}
          className="md:col-span-1"
        />
      </BentoGrid>

      {/* Modales para editar información */}
      <EditPersonalInfoModal
        isOpen={openModal === "personal"}
        onClose={handleCloseModal}
        onSubmit={updatePersonal}
        initialData={profile.personalInfo}
        isSaving={isSaving}
      />

      <EditContactInfoModal
        isOpen={openModal === "contact"}
        onClose={handleCloseModal}
        onSubmit={updateContact}
        initialData={profile.contactInfo}
        isSaving={isSaving}
      />

      <EditBillingInfoModal
        isOpen={openModal === "billing"}
        onClose={handleCloseModal}
        onSubmit={updateBilling}
        initialData={profile.billingInfo}
        isSaving={isSaving}
      />

      <EditBankInfoModal
        isOpen={openModal === "bank"}
        onClose={handleCloseModal}
        onSubmit={updateBank}
        initialData={profile.bankInfo}
        isSaving={isSaving}
      />
    </div>
  );
}
