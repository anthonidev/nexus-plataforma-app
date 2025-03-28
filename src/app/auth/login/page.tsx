"use client";
import ThemeSwitch from "@/components/common/ThemeSwich";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  KeyRound,
  Leaf,
  Loader2,
  LockKeyhole,
  Mail,
  Network,
  Sparkles,
  User,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

// Importamos los componentes específicos de forma dinámica para evitar errores de SSR
const NexusGrowthVisual = dynamic(
  () => import("../components/NexusGrowthVisual"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    ),
  }
);
const NexusParticlesBackground = dynamic(
  () => import("../components/NexusParticlesBackground"),
  { ssr: false }
);

// Importar estilos de animación

// Tipos para los datos del formulario
interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    email: "master@example.com",
    password: "Master123",
  });
  const [mounted, setMounted] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(false);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Para asegurar que las animaciones no causen problemas durante SSR
  useEffect(() => {
    setMounted(true);

    // Mostrar partículas con delay para mejorar la experiencia
    const timer = setTimeout(() => {
      setParticlesVisible(true);
    }, 500);

    // Efecto de carga del globo con un pequeño retraso
    const globeTimer = setTimeout(() => {
      setIsGlobeLoaded(true);
    }, 800);

    return () => {
      clearTimeout(timer);
      clearTimeout(globeTimer);
    };
  }, []);

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

      // Añadimos una transición de salida antes de redirigir
      if (cardRef.current) {
        cardRef.current.style.transform = "scale(0.9)";
        cardRef.current.style.opacity = "0";
      }

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 500);
    } catch {
      setError("Ocurrió un error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un efecto de ondas cuando se hace clic en el botón
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      event.clientX - button.getBoundingClientRect().left - radius
    }px`;
    circle.style.top = `${
      event.clientY - button.getBoundingClientRect().top - radius
    }px`;
    circle.classList.add("ripple-effect");

    // Limpiar efecto anterior si existe
    const ripple = button.getElementsByClassName("ripple-effect")[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
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
  };

  // Mapas de colores basados en temas
  const getThemeColors = () => {
    if (theme === "dark") {
      return {
        primary: "from-emerald-400 to-teal-600",
        secondary: "from-blue-400 to-purple-600",
        accent: "from-purple-500 to-pink-600",
        background: "from-gray-900 via-gray-800 to-gray-900",
        card: "bg-gray-800/90",
        border: "border-gray-700",
        text: "text-gray-100",
        glow: "bg-teal-500/20",
        globe: "from-teal-600 to-emerald-400",
      };
    }
    return {
      primary: "from-emerald-500 to-teal-700",
      secondary: "from-blue-500 to-purple-700",
      accent: "from-purple-600 to-pink-700",
      background: "from-white via-gray-50 to-gray-100",
      card: "bg-white/90",
      border: "border-gray-200",
      text: "text-gray-900",
      glow: "bg-teal-500/10",
      globe: "from-teal-700 to-emerald-500",
    };
  };

  const colors = getThemeColors();

  if (!mounted) {
    return null; // No renderizar nada hasta que el componente esté montado en el cliente
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background perspective-1000 login-container">
      {/* Fondo con partículas */}
      {particlesVisible && <NexusParticlesBackground />}

      {/* Fondo animado adicional */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden z-0">
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colors.background} opacity-90`}
        />

        {/* Patrón de puntos */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000000_30%,transparent_100%)]" />

        {/* Efectos de luz para más profundidad */}
        <motion.div
          className={`absolute -top-20 -left-20 w-96 h-96 rounded-full ${colors.glow} blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className={`absolute bottom-10 right-10 w-80 h-80 rounded-full ${colors.glow} blur-3xl`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Contenedor del contenido */}
      <motion.div
        className="w-full max-w-6xl px-4 py-8 z-10 flex flex-col md:flex-row gap-8 items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Lado izquierdo - Globo 3D con efectos */}
        <motion.div
          className="relative w-full max-w-md order-2 md:order-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isGlobeLoaded ? 1 : 0,
            y: isGlobeLoaded ? 0 : 20,
          }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {/* Componente de globo 3D */}
          <div className="flex items-center justify-center">
            <NexusGrowthVisual size={320} />
          </div>

          {/* Texto descriptivo */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h2 className="text-2xl font-bold text-primary mb-2">
              Nexus Global Network
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Conectando personas, construyendo futuro. Únete a nuestra red
              global de oportunidades.
            </p>
          </motion.div>

          {/* Features - iconos con texto */}
          <motion.div
            className="mt-8 grid grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: 1.5, staggerChildren: 0.1 }}
          >
            {[
              { icon: <Network size={20} />, text: "Red Global" },
              { icon: <Sparkles size={20} />, text: "Oportunidades" },
              { icon: <Leaf size={20} />, text: "Crecimiento" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  {item.icon}
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Lado derecho - Formulario de login con efectos */}
        <motion.div
          className="w-full max-w-md order-1 md:order-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          ref={cardRef}
        >
          <div className="relative">
            {/* Card glow effect */}
            <motion.div
              className={`absolute -inset-1 bg-primary/20 rounded-2xl blur-md opacity-70 z-0`}
              animate={{
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Efecto de partículas alrededor del formulario */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`form-particle-${i}`}
                className="absolute w-2 h-2 bg-primary rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.5,
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, Math.sin(i) * 10, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Main card */}
            <Card
              className={`relative ${colors.card} backdrop-blur-lg ${colors.border} shadow-xl rounded-2xl overflow-hidden z-10 glow-border`}
            >
              <CardHeader className="space-y-3 pt-8">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    className="w-24 p-2 h-24 rounded-full bg-primary/10 mb-4 flex items-center justify-center overflow-hidden group"
                    animate={{
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0 rgba(0, 128, 96, 0)",
                        "0 0 15px rgba(0, 128, 96, 0.3)",
                        "0 0 0 rgba(0, 128, 96, 0)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Logo con brillo */}
                    <div className="relative">
                      <Image
                        src={"/imgs/logo.png"}
                        alt="Logo"
                        width={100}
                        height={100}
                        className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                      />
                      <motion.div
                        className="absolute top-0 -inset-x-10 h-40 w-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          left: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        style={{
                          WebkitMaskImage: "linear-gradient(black, black)",
                          WebkitMaskSize: "100% 100%",
                          WebkitMaskPosition: "center",
                        }}
                      />
                    </div>
                  </motion.div>

                  <CardTitle className="text-2xl font-bold text-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="relative inline-block"
                    >
                      Bienvenido a Nexus
                      <motion.span
                        className="absolute bottom-0 left-0 bg-primary h-0.5 w-0"
                        animate={{ width: "100%" }}
                        transition={{ delay: 1, duration: 0.8 }}
                      />
                    </motion.span>
                  </CardTitle>

                  <CardDescription className="text-center text-muted-foreground mt-2">
                    Ingresa tus credenciales para acceder al sistema
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent>
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Email field */}
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium flex items-center gap-2 ml-1"
                    >
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Correo Electrónico
                    </Label>
                    <div className="relative overflow-hidden group transition-all duration-300">
                      <motion.div
                        className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <div className="relative bg-background rounded-xl border border-border shadow-sm overflow-hidden">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="correo@ejemplo.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-0 bg-transparent pl-11 h-12 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />

                        {/* Efecto de brillo en hover */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                          animate={{}}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Password field */}
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium flex items-center gap-2 ml-1"
                    >
                      <LockKeyhole className="h-3.5 w-3.5 text-muted-foreground" />
                      Contraseña
                    </Label>
                    <div className="relative group transition-all duration-300">
                      <motion.div
                        className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <div className="relative bg-background rounded-xl border border-border shadow-sm overflow-hidden">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="border-0 bg-transparent pl-11 h-12 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />

                        {/* Efecto de brillo en hover */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                          animate={{}}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Error message */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <Alert
                          variant="destructive"
                          className="flex items-center gap-3 border border-red-500/30 bg-red-500/10 text-red-500 shadow-md rounded-xl px-4 py-3"
                        >
                          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-red-500/20">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </div>
                          <div className="flex-1">
                            <AlertDescription className="text-red-500/90 text-sm">
                              {error}
                            </AlertDescription>
                          </div>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <motion.div variants={itemVariants}>
                    <motion.div
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        {/* Efecto de brillo al botón */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80"
                          animate={{
                            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />

                        {/* Efecto de partículas en el botón */}
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={`btn-particle-${i}`}
                            className="absolute bg-white rounded-full w-1 h-1"
                            style={{
                              top: `${20 + Math.random() * 60}%`,
                              left: `${Math.random() * 100}%`,
                              opacity: 0,
                            }}
                            animate={{
                              y: [0, -10, 0],
                              opacity: [0, 0.5, 0],
                              scale: [0, 1, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: Math.random() * 5,
                              ease: "easeInOut",
                            }}
                          />
                        ))}

                        <Button
                          type="submit"
                          className="relative w-full h-12 rounded-xl text-base font-medium bg-primary/90 hover:bg-primary/80 text-primary-foreground border-0 shadow-md backdrop-blur-sm z-10 overflow-hidden group login-button"
                          disabled={
                            loading || !formData.email || !formData.password
                          }
                          onClick={createRipple}
                        >
                          {/* Efecto de brillo en hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                          </div>

                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              <span className="relative z-10">Cargando...</span>
                            </>
                          ) : (
                            <div className="flex items-center justify-center gap-2 font-medium">
                              <span className="relative z-10">
                                Iniciar Sesión
                              </span>
                              <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatDelay: 2,
                                }}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.div>
                            </div>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.form>
              </CardContent>

              <CardFooter className="text-center pb-8">
                <motion.div
                  className="w-full flex flex-col items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {/* Separador con efecto */}
                  <div className="relative w-full flex items-center justify-center my-2">
                    <div className="absolute w-full h-px bg-border" />
                    <span className="relative bg-card px-3 text-xs text-muted-foreground z-10">
                      NEXUS GLOBAL NETWORK
                    </span>
                  </div>

                  <motion.p
                    className="text-sm text-muted-foreground w-full opacity-70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 0.8 }}
                  >
                    ¿Olvidaste tu contraseña? Por favor, contacta con el
                    administrador del sistema.
                  </motion.p>
                </motion.div>
              </CardFooter>
            </Card>
          </div>

          {/* Theme switch with animation */}
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              className="relative"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              {/* Efecto de resplandor */}
              <motion.div
                className="absolute -inset-1 bg-primary/20 rounded-full blur-sm opacity-0 hover:opacity-70"
                animate={{
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <ThemeSwitch />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
