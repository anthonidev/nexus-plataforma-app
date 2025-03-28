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
  Home,
  KeyRound,
  Leaf,
  Loader2,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  // Para asegurar que las animaciones no causen problemas durante SSR
  useEffect(() => {
    setMounted(true);
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
      router.push("/");
      router.refresh();
    } catch {
      setError("Ocurrió un error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

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

  // Generate leaf particles for animated background
  const generateLeaves = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: 8 + Math.random() * 16,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: 20 + Math.random() * 40,
      delay: Math.random() * 5,
    }));
  };

  const leaves = generateLeaves(200);

  if (!mounted) {
    return null; // No renderizar nada hasta que el componente esté montado en el cliente
  }
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated background */}

      <div aria-hidden="true" className="absolute inset-0 overflow-hidden z-0">
        {/* Gradient spots */}
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
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
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
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

        {/* Animated leaf particles */}
        <div className="absolute inset-0 pointer-events-none">
          {leaves.map((leaf) => (
            <motion.div
              key={leaf.id}
              className="absolute text-primary/35"
              style={{
                fontSize: `${leaf.size}px`,
                left: `${leaf.x}%`,
                top: `${leaf.y}%`,
                rotate: `${leaf.rotation}deg`,
              }}
              animate={{
                y: [0, -100],
                x: [0, Math.sin(leaf.id) * 50],
                rotate: [
                  leaf.rotation,
                  leaf.rotation + (Math.random() > 0.5 ? 360 : -360),
                ],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: leaf.duration,
                repeat: Infinity,
                delay: leaf.delay,
                ease: "linear",
              }}
            >
              <Leaf />
            </motion.div>
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('/grid-pattern.svg')] bg-repeat"></div>
      </div>

      {/* Content container */}
      <motion.div
        className="w-full max-w-lg px-4 py-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo at the top */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <motion.div
            className="flex items-center gap-3 bg-card px-6 py-3 rounded-full border border-border shadow-md"
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 60, 40, 0.1)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Home className="h-7 w-7 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold text-primary">NEXUS H. GLOBAL</h1>
          </motion.div>
        </motion.div>

        {/* Form container */}
        <motion.div
          className="w-full mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            {/* Card glow effect */}
            <motion.div
              className="absolute -inset-1 bg-primary/20 rounded-2xl blur-md opacity-70"
              animate={{
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            ></motion.div>

            {/* Main card */}
            <Card className="relative bg-card/95 backdrop-blur-sm border-border shadow-xl rounded-2xl overflow-hidden z-10">
              <CardHeader className="space-y-3 pt-8">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    className="w-24 p-2 h-24 rounded-full bg-primary/10 mb-4 flex items-center justify-center"
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
                    <Image
                      src={"/imgs/logo.png"}
                      alt="Logo"
                      width={100}
                      height={100}
                    />
                  </motion.div>

                  <CardTitle className="text-2xl font-bold text-center">
                    Bienvenido
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
                    <div className="relative group transition-all duration-300">
                      <motion.div
                        className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      ></motion.div>
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
                      ></motion.div>
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
                      <Button
                        type="submit"
                        className="w-full h-12 rounded-xl text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-md"
                        disabled={
                          loading || !formData.email || !formData.password
                        }
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Cargando...
                          </>
                        ) : (
                          <div className="flex items-center justify-center gap-2 font-medium">
                            Iniciar Sesión
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
                    </motion.div>
                  </motion.div>
                </motion.form>
              </CardContent>

              <CardFooter className="text-center pb-8">
                <motion.p
                  className="text-sm text-muted-foreground w-full opacity-70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.8 }}
                >
                  ¿Olvidaste tu contraseña? Por favor, contacta con el
                  administrador del sistema.
                </motion.p>
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
            <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }}>
              <ThemeSwitch />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
