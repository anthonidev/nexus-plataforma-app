"use client";

import { useParams, useSearchParams } from "next/navigation";
import RegisterForm from "./components/RegisterForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const params = useParams<{ referrerCode: string }>();
  const searchParams = useSearchParams();
  const position = searchParams.get("lado");
  const referrerCode = params.referrerCode;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src="/imgs/logo.png"
                alt="Nexus Logo"
                width={40}
                height={40}
                className="w-auto h-10"
              />
              <span className="font-bold text-lg">Nexus Global</span>
            </div>
          </Link>
          <Link href="/auth/login">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Inicio de Sesión
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold tracking-tight">
              Únete a Nexus Global
            </h1>
            <p className="text-muted-foreground mt-2">
              {referrerCode !== "new" ? (
                <>
                  Te estás registrando con el código de referido:{" "}
                  <span className="font-semibold">{referrerCode}</span>
                  {position && (
                    <>
                      {" "}
                      en el lado{" "}
                      <span className="font-semibold">
                        {position === "izquierda" ? "izquierdo" : "derecho"}
                      </span>
                    </>
                  )}
                  {!position && (
                    <>
                      {" "}
                      en el lado{" "}
                      <span className="font-semibold">
                        derecho (por defecto)
                      </span>
                    </>
                  )}
                </>
              ) : (
                "Crea tu cuenta para acceder a la plataforma"
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <RegisterForm />
          </motion.div>
        </div>
      </main>

      <footer className="border-t py-6 px-4 text-center text-muted-foreground text-sm">
        <p>
          © {new Date().getFullYear()} Nexus Global Network. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}
