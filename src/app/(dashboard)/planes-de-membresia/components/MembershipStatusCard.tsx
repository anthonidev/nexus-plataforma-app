"use client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  AlertOctagon,
  Award,
  Calendar,
  CheckCircle,
  ClockIcon,
  RefreshCw,
} from "lucide-react";

interface MembershipStatusProps {
  userMembership: {
    status?: "PENDING" | "ACTIVE" | "EXPIRED" | "INACTIVE";
    plan?: { id: number; name: string; price: string };
    nextReconsumptionDate?: string;
    endDate?: string;
    message?: string;
  };
  onSelectPlan: (planId: number) => void;
}

const formatDate = (dateString?: string) =>
  dateString ? format(new Date(dateString), "dd/MM/yyyy") : "No disponible";

const InfoLabel = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex justify-between items-center mt-2">
    <span className="text-sm">{label}:</span>
    <span className="font-medium flex items-center gap-1.5">
      {icon}
      {value}
    </span>
  </div>
);

const StatusCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={` border overflow-hidden mb-8 ${className}`}
  >
    {children}
  </motion.div>
);

const membershipConfig = {
  PENDING: {
    border: "border-amber-200 dark:border-amber-700",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    icon: <ClockIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    title: "Membresía pendiente de aprobación",
    description: "Tu solicitud está en proceso de revisión.",
    infoBg: "bg-amber-50/50 dark:bg-amber-900/10",
    infoBorder: "border-amber-100 dark:border-amber-800/50",
  },
  ACTIVE: {
    border: "border-green-200 dark:border-green-700",
    bg: "bg-green-50 dark:bg-green-900/30",
    icon: (
      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
    ),
    title: "Membresía activa",
    description: "Actualmente tienes el plan activo.",
    infoBg: "bg-green-50/50 dark:bg-green-900/10",
    infoBorder: "border-green-100 dark:border-green-800/50",
  },
  EXPIRED: {
    border: "border-red-200 dark:border-red-700",
    bg: "bg-red-50 dark:bg-red-900/30",
    icon: <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />,
    title: "Membresía expirada",
    description: "Tu membresía ha expirado.",
    infoBg: "bg-red-50/50 dark:bg-red-900/10",
    infoBorder: "border-red-100 dark:border-red-800/50",
  },
};

export default function MembershipStatusCard({
  userMembership,
  onSelectPlan,
}: MembershipStatusProps) {
  if (
    !userMembership ||
    !userMembership.status ||
    userMembership.status === "INACTIVE"
  )
    return null;
  const config = membershipConfig[userMembership.status];

  return (
    <StatusCard className={config.border}>
      <div
        className={`${config.bg} px-6 py-4 flex items-center gap-3 border-b`}
      >
        <div className="p-2 rounded-full">{config.icon}</div>
        <div>
          <h3 className="font-semibold text-lg">{config.title}</h3>
          <p className="text-sm">{config.description}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6">
        {userMembership.message && (
          <div className="mb-4 p-3 bg-opacity-50 border-l-4 rounded">
            <p>{userMembership.message}</p>
          </div>
        )}
        <div
          className={`${config.infoBg} p-4 rounded-md border ${config.infoBorder}`}
        >
          <InfoLabel
            label="Plan"
            value={userMembership.plan?.name || "No disponible"}
            icon={<Award className="h-4 w-4" />}
          />
          {userMembership.status !== "PENDING" && (
            <InfoLabel
              label="Fecha de expiración"
              value={formatDate(userMembership.endDate)}
              icon={<Calendar className="h-4 w-4" />}
            />
          )}
          {userMembership.status === "EXPIRED" && (
            <Button
              onClick={() => onSelectPlan(userMembership.plan?.id || 0)}
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Renovar
            </Button>
          )}
        </div>
      </div>
    </StatusCard>
  );
}
