"use client";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session } = useSession();
  const hasMembership = session?.user?.membership?.hasMembership;

  return (
    <div className="flex flex-col gap-6 h-full w-full mx-auto max-w-7xl p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Verificar si el usuario no tiene membresía activa */}
      {session && !hasMembership && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            variant="default"
            className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 relative overflow-hidden"
          >
            {/* Efecto de gradiente animado */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              }}
            />

            <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            <div className="flex-1 ml-3">
              <AlertTitle className="text-amber-700 dark:text-amber-400 font-semibold text-base">
                Membresía no activa
              </AlertTitle>
              <AlertDescription className="text-amber-600 dark:text-amber-300/80 mt-1">
                Para acceder a todas las funcionalidades y beneficios de la
                plataforma, necesitas suscribirte a uno de nuestros planes.
              </AlertDescription>

              <div className="mt-4">
                <Link href="/planes" passHref>
                  <Button
                    className="gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0"
                    size="sm"
                  >
                    Ver planes disponibles
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Alert>
        </motion.div>
      )}

      {/* Resto del contenido del dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {/* Aquí iría el contenido principal del dashboard */}
      </div>
    </div>
  );
}
