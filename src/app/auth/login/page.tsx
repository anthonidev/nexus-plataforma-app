"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, KeyRound, Mail, AlertCircle } from "lucide-react";
import BackgroundPattern from "@/app/auth/components/BackgroundPattern";
import ThemeSwitch from "@/components/common/ThemeSwich";
interface FormData {
  email: string;
  password: string;
}
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    email: "master@example.com",
    password: "Master123",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (result?.error) {
        setError("Credenciales inválidas");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Ocurrió un error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {}
      <BackgroundPattern />
      {}
      <div className="w-full max-w-4xl mx-4 md:mx-auto grid md:grid-cols-2 gap-8 items-center relative">
        {}
        <motion.div
          className="hidden md:flex flex-col space-y-8 p-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Building2 className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold text-primary">PropertyPro</h1>
          </motion.div>
          <div className="space-y-4">
            <motion.h2
              className="text-2xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Bienvenido a tu Sistema de Gestión Inmobiliaria
            </motion.h2>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Administra tus propiedades, contratos y clientes desde una única
              plataforma intuitiva y profesional.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <ThemeSwitch />
          </motion.div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-[2px] bg-card/80 shadow-lg dark:shadow-primary/5">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-center">
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-background/50 focus:bg-background transition-all"
                    />
                  </div>
                </motion.div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-background/50 focus:bg-background transition-all"
                    />
                  </div>
                </motion.div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                    className="w-full max-w-sm mx-auto"
                  >
                    <Alert
                      variant="destructive"
                      role="alert"
                      className="flex items-center gap-3 border border-red-500/50 bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 shadow-md rounded-md px-3 py-1"
                    >
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-red-500/20 dark:bg-red-500/30">
                        <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 text-md">
                        <AlertDescription className="text-red-600/80 text-xs dark:text-red-400/80">
                          {error}
                        </AlertDescription>
                      </div>
                    </Alert>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !formData.email || !formData.password}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="text-center">
              <p className="text-sm text-muted-foreground w-full">
                ¿Olvidaste tu contraseña? Por favor, ponte en contacto con el
                administrador del sistema para asistencia.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
