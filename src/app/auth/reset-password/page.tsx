"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Mail,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { requestPasswordReset } from "@/lib/actions/auth/password-reset.action";
import Image from "next/image";
import ThemeSwitch from "@/components/common/ThemeSwich";

const formSchema = z.object({
    email: z
        .string()
        .email({ message: "El correo debe tener un formato válido" })
        .min(1, { message: "El correo es requerido" }),
});

type FormData = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetRequested, setResetRequested] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successEmail, setSuccessEmail] = useState<string>("");

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: FormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await requestPasswordReset(values.email);

            if (response.success) {
                setResetRequested(true);
                setSuccessEmail(values.email);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al solicitar recuperación de contraseña"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <ThemeSwitch />

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

            <main className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {!resetRequested ? (
                        <Card className="shadow-lg border-border">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl font-bold text-center">
                                    Recuperar contraseña
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Ingresa tu correo electrónico para recibir las instrucciones
                                    de recuperación
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Correo electrónico</FormLabel>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <FormControl>
                                                            <Input
                                                                placeholder="correo@ejemplo.com"
                                                                className="pl-10"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                "Enviar instrucciones"
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <p className="text-sm text-muted-foreground">
                                    Regresa a{" "}
                                    <Link
                                        href="/auth/login"
                                        className="text-primary hover:underline"
                                    >
                                        Iniciar sesión
                                    </Link>
                                </p>
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card className="shadow-lg border-border bg-card">
                            <CardHeader className="space-y-1">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <CardTitle className="text-2xl font-bold text-center mt-4">
                                    Solicitud enviada
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Hemos enviado instrucciones para restablecer tu contraseña a
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-center">
                                <div className="font-medium text-lg">{successEmail}</div>
                                <p className="text-muted-foreground">
                                    Revisa tu bandeja de entrada y sigue las instrucciones para
                                    completar el proceso. El enlace será válido por 24 horas.
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Link href="/auth/login">
                                    <Button variant="outline">Volver a Iniciar Sesión</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    )}
                </motion.div>
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