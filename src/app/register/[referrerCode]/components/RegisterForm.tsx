"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { RegisterFormData, useRegister } from "../hooks/useRegister";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Esquema de validación con zod
const registerSchema = z.object({
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
});

export default function RegisterForm() {
  const {
    isLoading,
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

  // Inicializar formulario con react-hook-form y zod
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      gender: undefined,
      roleCode: "CLI", // Siempre usamos el rol CLI
    },
  });

  // Cargar ubigeos al montar el componente
  useEffect(() => {
    fetchUbigeos();
  }, [fetchUbigeos]);

  // Manejar envío del formulario
  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    // Convertir los valores del formulario al formato esperado por el hook
    const formData: RegisterFormData = {
      ...values,
      birthDate: values.birthDate.toISOString().split("T")[0],
    };

    // Log para depuración
    console.log("Valores del formulario:", values);
    console.log("Datos formateados:", formData);

    handleSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Registro de Usuario</CardTitle>
        <CardDescription>
          Completa el formulario para crear tu cuenta
          {referrerCode && (
            <div className="mt-2">
              <Badge
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                <Info className="h-3 w-3" />
                Código de referido: {referrerCode}
                {position && (
                  <span className="ml-1">
                    (Lado: {position === "LEFT" ? "Izquierdo" : "Derecho"})
                  </span>
                )}
              </Badge>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error al registrar</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Datos de la cuenta */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Datos de la cuenta</h3>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Debe contener al menos 6 caracteres, una mayúscula, una
                        minúscula y un número
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Datos personales */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Datos personales</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
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
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu apellido" {...field} />
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
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+51 999 888 777" {...field} />
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
                        <FormLabel>Fecha de nacimiento</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
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
                        <FormLabel>Género</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar género" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MASCULINO">Masculino</SelectItem>
                            <SelectItem value="FEMENINO">Femenino</SelectItem>
                            <SelectItem value="OTRO">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Ubicación</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const numValue = parseInt(value);
                            field.onChange(numValue);
                            handleDepartmentChange(numValue);
                          }}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
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
                        <FormLabel>Provincia</FormLabel>
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
                            <SelectTrigger>
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
                        <FormLabel>Distrito</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={field.value?.toString()}
                          disabled={districts.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
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
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Registrarme"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
