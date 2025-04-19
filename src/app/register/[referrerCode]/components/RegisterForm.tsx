"use client";

import TermsAndConditionsModal from "@/components/common/TermsAndConditionsModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
  MapPin,
  PartyPopper,
  Phone,
  User,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RegisterFormData, useRegister } from "../hooks/useRegister";

const registerSchema = z
  .object({
    email: z
      .string()
      .email({ message: "El correo debe tener un formato válido" }),
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/, {
        message:
          "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
      }),
    passwordConfirm: z.string(),
    firstName: z.string().min(1, { message: "El nombre es requerido" }),
    lastName: z.string().min(1, { message: "El apellido es requerido" }),
    phone: z
      .string()
      .min(1, { message: "El celular es requerido" })
      .regex(/^[0-9+()-\s]+$/, {
        message:
          "El celular solo debe contener números, símbolos (+, -, ()) y espacios",
      }),
    birthDate: z.date({
      required_error: "La fecha de nacimiento es requerida",
    }),
    gender: z.enum(["MASCULINO", "FEMENINO", "OTRO"], {
      required_error: "El género es requerido",
    }),
    departmentId: z.number({
      required_error: "El departamento es requerido",
    }),
    provinceId: z.number({
      required_error: "La provincia es requerida",
    }),
    districtId: z.number({
      required_error: "El distrito es requerido",
    }),
    roleCode: z.string().default("CLI"), // Rol fijo como "CLI"
    termsAccepted: z.boolean().refine(val => val === true, {
      message: "Debes aceptar los términos y condiciones"
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
  });

export default function RegisterForm() {
  const router = useRouter();
  const {
    isSubmitting,
    error,
    referrerCode,
    position,
    departments,
    provinces,
    districts,
    fetchUbigeos,
    handleDepartmentChange,
    handleProvinceChange,
    handleSubmit,
  } = useRegister();

  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredUserData, setRegisteredUserData] = useState<
    Partial<z.infer<typeof registerSchema>>
  >({});
  const [activeStep, setActiveStep] = useState(1);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      firstName: "",
      lastName: "",
      phone: "",
      gender: undefined,
      roleCode: "CLI",
      termsAccepted: false,
    },
    mode: "onChange",
  });

  const canProceedToStep2 = form.watch("email") && form.watch("password") &&
    form.watch("passwordConfirm") && !form.formState.errors.email &&
    !form.formState.errors.password && !form.formState.errors.passwordConfirm;

  const canProceedToStep3 = form.watch("firstName") && form.watch("lastName") &&
    form.watch("phone") && form.watch("birthDate") && form.watch("gender") &&
    !form.formState.errors.firstName && !form.formState.errors.lastName &&
    !form.formState.errors.phone && !form.formState.errors.birthDate &&
    !form.formState.errors.gender;

  const isFormValid = canProceedToStep2 && canProceedToStep3 &&
    form.watch("departmentId") && form.watch("provinceId") &&
    form.watch("districtId") && form.watch("termsAccepted") &&
    !form.formState.errors.departmentId && !form.formState.errors.provinceId &&
    !form.formState.errors.districtId && !form.formState.errors.termsAccepted;

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#4ade80', '#34d399', '#10b981', '#059669', '#047857'],
    });
  };

  useEffect(() => {
    fetchUbigeos();
  }, [fetchUbigeos]);

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    const formData: RegisterFormData = {
      ...values,
      birthDate: values.birthDate.toISOString().split("T")[0],
    };

    setRegisteredUserData({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    });

    handleSubmit(formData).then((success) => {
      if (success) {
        setRegistrationSuccess(true);
        setTimeout(() => {
          triggerConfetti();
        }, 300);
      }
    });
  };

  const handleStepChange = (step: number) => {
    if (step > activeStep) {
      switch (activeStep) {
        case 1:
          if (!canProceedToStep2) {
            form.trigger(["email", "password", "passwordConfirm"]);
            return;
          }
          break;
        case 2:
          if (!canProceedToStep3) {
            form.trigger(["firstName", "lastName", "phone", "birthDate", "gender"]);
            return;
          }
          break;
      }
    }
    setActiveStep(step);
  };

  const handleGoToLogin = () => {
    form.reset();
    setActiveStep(1);
    setRegistrationSuccess(false);
    router.push("/auth/login");
  };

  const handleCloseModal = () => {
    form.reset();
    setActiveStep(1);
    setRegistrationSuccess(false);
  };


  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-lg overflow-hidden border-primary/20">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-primary" />
              Registro de Usuario
            </CardTitle>
            <CardDescription>
              Completa el formulario para crear tu cuenta
              {referrerCode && (
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1 border-primary/30 bg-primary/5"
                  >
                    <Info className="h-3 w-3" />
                    Código de referido: <span className="font-semibold">{referrerCode}</span>
                    {position && (
                      <span className="ml-1">
                        (Lado: <span className="font-semibold">{position === "LEFT" ? "Izquierdo" : "Derecho"}</span>)
                      </span>
                    )}
                  </Badge>
                </div>
              )}
            </CardDescription>
          </CardHeader>

          <div className="flex justify-between px-8 py-2 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted-foreground/20 -translate-y-1/2 mx-12" />

            <motion.div
              onClick={() => handleStepChange(1)}
              className={`z-10 flex flex-col items-center cursor-pointer`}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${activeStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`}>
                1
              </div>
              <span className={`text-xs mt-1 ${activeStep === 1 ? "font-medium text-primary" : "text-muted-foreground"}`}>Cuenta</span>
            </motion.div>

            <motion.div
              onClick={() => canProceedToStep2 ? handleStepChange(2) : null}
              className={`z-10 flex flex-col items-center ${canProceedToStep2 ? "cursor-pointer" : "cursor-not-allowed"}`}
              whileHover={canProceedToStep2 ? { scale: 1.05 } : {}}
            >
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${activeStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`}>
                2
              </div>
              <span className={`text-xs mt-1 ${activeStep === 2 ? "font-medium text-primary" : "text-muted-foreground"}`}>Personal</span>
            </motion.div>

            <motion.div
              onClick={() => canProceedToStep3 ? handleStepChange(3) : null}
              className={`z-10 flex flex-col items-center ${canProceedToStep3 ? "cursor-pointer" : "cursor-not-allowed"}`}
              whileHover={canProceedToStep3 ? { scale: 1.05 } : {}}
            >
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${activeStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`}>
                3
              </div>
              <span className={`text-xs mt-1 ${activeStep === 3 ? "font-medium text-primary" : "text-muted-foreground"}`}>Ubicación</span>
            </motion.div>
          </div>
        </div>

        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error al registrar</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Lock className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-medium">Datos de la cuenta</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          Correo electrónico
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="correo@ejemplo.com"
                            {...field}
                            className="h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                            Contraseña
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                {...field}
                                className="h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
                            Debe contener al menos 6 caracteres, una mayúscula,
                            una minúscula y un número
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="passwordConfirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                            Confirmar contraseña
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPasswordConfirm ? "text" : "password"}
                                placeholder="********"
                                {...field}
                                className="h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() =>
                                  setShowPasswordConfirm(!showPasswordConfirm)
                                }
                              >
                                {showPasswordConfirm ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
                            Repite la contraseña para confirmar
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        onClick={() => handleStepChange(2)}
                        disabled={!canProceedToStep2}
                        className="w-full md:w-auto min-w-[10rem]"
                      >
                        Siguiente
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-medium">Datos personales</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            Nombre
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu nombre"
                              {...field}
                              className="h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            Apellido
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu apellido"
                              {...field}
                              className="h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          Teléfono
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="999 888 777"
                            {...field}
                            className="h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="flex items-center gap-1.5">
                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            Fecha de nacimiento
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Seleccionar fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                defaultMonth={
                                  field.value ?? new Date(Date.now() - 567648000000) // 18 años atrás
                                }
                                initialFocus
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            Género
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                                <SelectValue placeholder="Seleccionar género" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MASCULINO">
                                Masculino
                              </SelectItem>
                              <SelectItem value="FEMENINO">Femenino</SelectItem>
                              <SelectItem value="OTRO">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleStepChange(1)}
                        className="w-full md:w-auto min-w-[10rem]"
                      >
                        Atrás
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        onClick={() => handleStepChange(3)}
                        disabled={!canProceedToStep3}
                        className="w-full md:w-auto min-w-[10rem]"
                      >
                        Siguiente
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-medium">Ubicación</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            Departamento
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const numValue = parseInt(value);
                              field.onChange(numValue);
                              handleDepartmentChange(numValue);
                            }}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                                <SelectValue placeholder="Seleccionar departamento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((department) => (
                                <SelectItem
                                  key={department.id}
                                  value={department.id.toString()}
                                >
                                  {department.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="provinceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            Provincia
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const numValue = parseInt(value);
                              field.onChange(numValue);
                              handleProvinceChange(numValue);
                            }}
                            defaultValue={field.value?.toString()}
                            disabled={provinces.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                                <SelectValue placeholder="Seleccionar provincia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.length > 0 ? (
                                provinces.map((province) => (
                                  <SelectItem
                                    key={province.id}
                                    value={province.id.toString()}
                                  >
                                    {province.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                  Seleccione un departamento primero
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="districtId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            Distrito
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={field.value?.toString()}
                            disabled={districts.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                                <SelectValue placeholder="Seleccionar distrito" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {districts.length > 0 ? (
                                districts.map((district) => (
                                  <SelectItem
                                    key={district.id}
                                    value={district.id.toString()}
                                  >
                                    {district.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                  Seleccione una provincia primero
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 mb-2">
                    <Separator className="mb-6" />
                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem

                          className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                setTermsAccepted(checked === true);
                              }}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm cursor-pointer">
                              Acepto los{" "}
                              <Button
                                variant="link"
                                className="p-0 h-auto text-sm font-medium underline text-primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setTermsModalOpen(true);
                                }}
                              >
                                Términos y Condiciones
                              </Button>
                            </FormLabel>
                            <FormMessage />
                          </div>
                          <TermsAndConditionsModal
                            open={termsModalOpen}
                            onOpenChange={setTermsModalOpen}
                            onAccept={(accepted) => {
                              setTermsAccepted(accepted);
                              field.onChange(accepted);
                            }}
                            isAccepted={termsAccepted}
                          />
                        </FormItem>
                      )}

                    />

                  </div>

                  <div className="pt-4 flex justify-between">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleStepChange(2)}
                        className="w-full md:w-auto min-w-[10rem]"
                      >
                        Atrás
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isFormValid}
                        className="w-full md:w-auto min-w-[10rem]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          "Registrarme"
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={registrationSuccess} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              ¡Registro Exitoso!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Tu cuenta ha sido creada correctamente.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 border rounded-lg bg-primary/5 dark:bg-primary/10 mt-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nombre:</p>
                <p className="font-medium">
                  {registeredUserData.firstName} {registeredUserData.lastName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Correo electrónico:
                </p>
                <p className="font-medium">{registeredUserData.email}</p>
              </div>
            </div>
          </div>

          <div className="my-2 flex justify-center">
            <PartyPopper className="h-16 w-16 text-primary animate-bounce" />
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button onClick={handleGoToLogin} className="bg-primary hover:bg-primary/90">
              Ir a Iniciar Sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}