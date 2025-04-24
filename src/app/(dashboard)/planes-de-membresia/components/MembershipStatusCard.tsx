"use client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  AlertOctagon,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronRight
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
  <div className="flex justify-between items-center py-2 border-b border-dashed last:border-0 border-opacity-20">
    <span className="text-sm font-medium">{label}</span>
    <span className="font-medium flex items-center gap-1.5 text-sm">
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
    className={`rounded-xl shadow-sm border overflow-hidden mb-8 ${className}`}
  >
    {children}
  </motion.div>
);

const membershipConfig = {
  PENDING: {
    border: "border-amber-200 dark:border-amber-700",
    bg: "bg-gradient-to-r from-amber-50 to-amber-100/80 dark:from-amber-900/30 dark:to-amber-800/20",
    icon: <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    title: "Membresía pendiente de aprobación",
    description: "Tu solicitud está en proceso de revisión.",
    infoBg: "bg-amber-50/50 dark:bg-amber-900/10",
    infoBorder: "border-amber-100 dark:border-amber-800/50",
    iconBg: "bg-amber-100 dark:bg-amber-800/30",
    pulseDot: "bg-amber-500",
    button: "bg-amber-600 hover:bg-amber-700 text-white"
  },
  ACTIVE: {
    border: "border-green-200 dark:border-green-700",
    bg: "bg-gradient-to-r from-green-50 to-green-100/80 dark:from-green-900/30 dark:to-green-800/20",
    icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
    title: "Membresía activa",
    description: "Actualmente tienes el plan activo.",
    infoBg: "bg-green-50/50 dark:bg-green-900/10",
    infoBorder: "border-green-100 dark:border-green-800/50",
    iconBg: "bg-green-100 dark:bg-green-800/30",
    pulseDot: "bg-green-500",
    button: "bg-green-600 hover:bg-green-700 text-white"
  },
  EXPIRED: {
    border: "border-red-200 dark:border-red-700",
    bg: "bg-gradient-to-r from-red-50 to-red-100/80 dark:from-red-900/30 dark:to-red-800/20",
    icon: <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />,
    title: "Membresía expirada",
    description: "Tu membresía ha expirado.",
    infoBg: "bg-red-50/50 dark:bg-red-900/10",
    infoBorder: "border-red-100 dark:border-red-800/50",
    iconBg: "bg-red-100 dark:bg-red-800/30",
    pulseDot: "bg-red-500",
    button: "bg-red-600 hover:bg-red-700 text-white"
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
        className={`${config.bg} px-6 py-5 flex items-center gap-4 border-b relative overflow-hidden`}
      >
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-white/10 blur-3xl -mr-10 -mt-10 opacity-60"></div>
        <div className="absolute left-0 bottom-0 w-20 h-20 rounded-full bg-black/5 blur-2xl -ml-10 -mb-10"></div>

        <div className={`h-12 w-12 rounded-full ${config.iconBg} flex items-center justify-center relative`}>
          {config.icon}
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full animate-pulse border-2 border-white dark:border-gray-800 flex items-center justify-center">
            <span className={`h-1.5 w-1.5 rounded-full ${config.pulseDot}`}></span>
          </span>
        </div>
        <div className="z-10">
          <h3 className="font-bold text-lg">{config.title}</h3>
          <p className="text-sm opacity-90">{config.description}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6">
        {userMembership.message && (
          <div className={`mb-5 p-4 ${config.infoBg} border-l-4 border-primary rounded-r-md text-sm`}>
            <div className="flex gap-2">
              <div className="text-primary mt-0.5">{config.icon}</div>
              <p className="text-foreground">{userMembership.message}</p>
            </div>
          </div>
        )}

        <div className={`${config.infoBg} p-5 rounded-xl border ${config.infoBorder} space-y-1`}>
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

          {userMembership.nextReconsumptionDate && userMembership.status === "ACTIVE" && (
            <InfoLabel
              label="Próximo reconsumo"
              value={formatDate(userMembership.nextReconsumptionDate)}
              icon={<Calendar className="h-4 w-4" />}
            />
          )}

          {userMembership.status === "EXPIRED" && (
            <motion.div
              className="mt-5 pt-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={() => onSelectPlan(userMembership.plan?.id || 0)}
                className={`mt-2 w-full ${config.button} group relative overflow-hidden`}
              >
                <div className="absolute inset-0 w-3/12 bg-white/20 skew-x-[-45deg] group-hover:skew-x-[-65deg] transition-all duration-500 group-hover:w-4/12 -translate-x-full group-hover:translate-x-[400%] ease-out"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Renovar membresía
                  <ChevronRight className="h-3 w-3" />
                </span>
              </Button>
            </motion.div>
          )}

          {userMembership.status === "ACTIVE" && (
            <div className="mt-4 pt-1 text-center">
              <p className="text-xs text-green-600 dark:text-green-400 flex justify-center items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Membresía activa hasta {formatDate(userMembership.endDate)}
              </p>
            </div>
          )}
        </div>
      </div>
    </StatusCard>
  );
}