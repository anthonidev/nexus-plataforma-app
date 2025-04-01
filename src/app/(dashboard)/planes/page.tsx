"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Check, Gem, Package, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMembershipPlans } from "./hooks/useMembership";

export default function MembershipPlansPage() {
  const router = useRouter();
  const { plans, isLoading, error, refetch } = useMembershipPlans({
    isActive: true,
  });

  // Función para formatear precio en soles
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(numPrice);
  };

  // Función para seleccionar un plan
  const handleSelectPlan = (planId: number) => {
    router.push(`/planes/detalle/${planId}`);
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const planVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  // Función para determinar el color del plan según nivel
  const getPlanColorScheme = (displayOrder: number) => {
    switch (displayOrder) {
      case 1: // Ejecutivo
        return {
          header: "bg-blue-50 dark:bg-blue-900/20",
          badge:
            "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
          icon: "text-blue-600 dark:text-blue-400",
          shadow: "shadow-blue-100 dark:shadow-blue-900/30",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          iconBg: "bg-blue-100 dark:bg-blue-800",
        };
      case 2: // VIP
        return {
          header: "bg-purple-50 dark:bg-purple-900/20",
          badge:
            "bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300",
          icon: "text-purple-600 dark:text-purple-400",
          shadow: "shadow-purple-100 dark:shadow-purple-900/30",
          button: "bg-purple-600 hover:bg-purple-700 text-white",
          iconBg: "bg-purple-100 dark:bg-purple-800",
        };
      case 3: // Premium
        return {
          header: "bg-amber-50 dark:bg-amber-900/20",
          badge:
            "bg-amber-100 text-amber-700 dark:bg-amber-700/30 dark:text-amber-300",
          icon: "text-amber-600 dark:text-amber-400",
          shadow: "shadow-amber-100 dark:shadow-amber-900/30",
          button: "bg-amber-600 hover:bg-amber-700 text-white",
          iconBg: "bg-amber-100 dark:bg-amber-800",
        };
      default:
        return {
          header: "bg-gray-50 dark:bg-gray-900/20",
          badge:
            "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300",
          icon: "text-gray-600 dark:text-gray-400",
          shadow: "shadow-gray-100 dark:shadow-gray-900/30",
          button: "bg-gray-600 hover:bg-gray-700 text-white",
          iconBg: "bg-gray-100 dark:bg-gray-800",
        };
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Planes de Membresía
          </h1>
          <p className="text-muted-foreground mt-2">
            Selecciona el plan que mejor se ajuste a tus necesidades y comienza
            tu camino al éxito
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-8">
          <p>Error al cargar los planes: {error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2"
          >
            Reintentar
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="border shadow-md">
              <CardHeader>
                <Skeleton className="h-7 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, idx) => (
                    <Skeleton key={`item-${idx}`} className="h-4 w-full" />
                  ))}
                </div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, idx) => (
                    <Skeleton key={`benefit-${idx}`} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan) => {
            const colors = getPlanColorScheme(plan.displayOrder);

            return (
              <motion.div
                key={plan.id}
                variants={planVariants}
                whileHover="hover"
                className="flex"
              >
                <Card
                  className={`flex flex-col border w-full transition-all duration-300 hover:shadow-lg ${colors.shadow}`}
                >
                  <CardHeader className={`${colors.header} rounded-t-lg`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Plan{" "}
                          {plan.displayOrder === 3
                            ? "Premium"
                            : plan.displayOrder === 2
                            ? "Recomendado"
                            : "Básico"}
                        </CardDescription>
                      </div>
                      <Badge className={`${colors.badge}`}>
                        {plan.displayOrder === 3
                          ? "TOP"
                          : plan.displayOrder === 2
                          ? "POPULAR"
                          : "BÁSICO"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 pt-6 space-y-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-muted-foreground ml-1">PEN</span>
                    </div>

                    {/* Productos incluidos */}
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <div className={`p-1 rounded-full ${colors.iconBg}`}>
                          <Package className={`h-4 w-4 ${colors.icon}`} />
                        </div>
                        Productos incluidos:
                      </h3>
                      <ul className="space-y-1">
                        {plan.products.map((product, idx) => (
                          <li
                            key={`product-${idx}`}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 mt-0.5 text-green-500" />
                            <span>{product}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Beneficios */}
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <div className={`p-1 rounded-full ${colors.iconBg}`}>
                          <Gem className={`h-4 w-4 ${colors.icon}`} />
                        </div>
                        Beneficios:
                      </h3>
                      <ul className="space-y-1">
                        {plan.benefits.map((benefit, idx) => (
                          <li
                            key={`benefit-${idx}`}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 mt-0.5 text-green-500" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                        {/* Datos adicionales */}
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 mt-0.5 text-green-500" />
                          <span>
                            Comisión directa:{" "}
                            {plan.directCommissionAmount === "0.00"
                              ? "No"
                              : `$${plan.directCommissionAmount}`}
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 mt-0.5 text-green-500" />
                          <span>
                            Porcentaje de comisión: {plan.commissionPercentage}%
                          </span>
                        </li>
                        {parseInt(plan.checkAmount) > 0 && (
                          <li className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 mt-0.5 text-green-500" />
                            <span>Bono de cheque: ${plan.checkAmount}</span>
                          </li>
                        )}
                        {plan.binaryPoints > 0 && (
                          <li className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 mt-0.5 text-green-500" />
                            <span>Puntos binarios: {plan.binaryPoints}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <motion.div
                      className="w-full"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        className={`w-full ${colors.button} relative overflow-hidden group h-12`}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {/* Efecto de brillo en hover */}
                        <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </div>

                        <div className="flex items-center justify-center gap-2 font-medium">
                          <span className="text-base">Ver detalles</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                        </div>
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {plans.length === 0 && !isLoading && !error && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">
            No hay planes disponibles
          </h3>
          <p>
            Actualmente no hay planes de membresía disponibles. Por favor,
            intenta más tarde.
          </p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Verificar nuevamente
          </Button>
        </div>
      )}
    </div>
  );
}
