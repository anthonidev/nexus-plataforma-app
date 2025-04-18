"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    resetPassword,
    verifyResetToken,
} from "@/lib/actions/auth/password-reset.action";
import Image from "next/image";

const formSchema = z
    .object({
        password: z
            .string()
            .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/, {
                message:
                    "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
            }),
        passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Las contraseñas no coinciden",
        path: ["passwordConfirm"],
    });

type FormData = z.infer<typeof formSchema>;

enum TokenStatus {
    CHECKING = "checking",
    VALID = "valid",
    INVALID = "invalid",
    RESET_SUCCESS = "reset_success",
    RESET_ERROR = "reset_error",
}

export default function ResetPasswordPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [tokenStatus, setTokenStatus] = useState<TokenStatus>(
        TokenStatus.CHECKING
    );
    const [userEmail, setUserEmail] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            passwordConfirm: "",
        },
    });

    useEffect(() => {
        async function checkToken() {
            try {
                const response = await verifyResetToken(token);
                if (response.success) {
                    setTokenStatus(TokenStatus.VALID);
                    if (response.email) {
                        setUserEmail(response.email);
                    }
                } else {
                    setTokenStatus(TokenStatus.INVALID);
                    setErrorMessage(response.message);
                }
            } catch (error) {
                setTokenStatus(TokenStatus.INVALID);
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Error al verificar el token"
                );
            }
        }

        checkToken();
    }, [token]);

    const onSubmit = async (values: FormData) => {
        setIsSubmitting(true);

        try {
            const response = await resetPassword(token, values.password);

            if (response.success) {
                setTokenStatus(TokenStatus.RESET_SUCCESS);
            } else {
                setTokenStatus(TokenStatus.RESET_ERROR);
                setErrorMessage(response.message);
            }
        } catch (error) {
            setTokenStatus(TokenStatus.RESET_ERROR);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Error al restablecer la contraseña"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        switch (tokenStatus) {
            case TokenStatus.CHECKING:
                return (
                    <Card className="shadow-lg border-border">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">
                                Verificando...
                            </CardTitle>
                            <CardDescription className="text-center">
                                Estamos verificando la validez de tu enlace
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </CardContent>
                    </Card>
                );

            case TokenStatus.INVALID:
                return (
                    <Card className="shadow-lg border-border">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center text-destructive">
                                Enlace inválido o expirado
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {errorMessage ||
                                        "El enlace para restablecer la contraseña es inválido o ha expirado."}
                                </AlertDescription>
                            </Alert>
                            <p className="text-center text-muted-foreground">
                                Por favor, solicita un nuevo enlace para restablecer tu contraseña.
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Link href="/auth/reset-password">
                                <Button>Solicitar nuevo enlace</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                );

            case TokenStatus.VALID:
                return (
                    <Card className="shadow-lg border-border">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">
                                Crear nueva contraseña
                            </CardTitle>
                            <CardDescription className="text-center">
                                {userEmail ? `Para la cuenta: ${userEmail}` : ""}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nueva contraseña</FormLabel>
                                                <div className="relative">
                                                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showPassword ? "text" : "password"}
                                                                className="pl-10 pr-10"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-0 top-0 h-full px-3"
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
                                                </div>
                                                <FormDescription className="text-xs">
                                                    Debe contener al menos 6 caracteres, una mayúscula, una
                                                    minúscula y un número
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
                                                <FormLabel>Confirmar contraseña</FormLabel>
                                                <div className="relative">
                                                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showPasswordConfirm ? "text" : "password"}
                                                                className="pl-10 pr-10"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-0 top-0 h-full px-3"
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
                                                Cambiando contraseña...
                                            </>
                                        ) : (
                                            "Cambiar contraseña"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                );

            case TokenStatus.RESET_SUCCESS:
                return (
                    <Card className="shadow-lg border-border">
                        <CardHeader className="space-y-1">
                            <div className="flex justify-center">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center mt-4">
                                ¡Contraseña restablecida!
                            </CardTitle>
                            <CardDescription className="text-center">
                                Tu contraseña ha sido actualizada correctamente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center py-4">
                            <p className="text-muted-foreground">
                                Ahora puedes iniciar sesión con tu nueva contraseña
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Link href="/auth/login">
                                <Button>Ir a iniciar sesión</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                );

            case TokenStatus.RESET_ERROR:
                return (
                    <Card className="shadow-lg border-border">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center text-destructive">
                                Error al restablecer contraseña
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {errorMessage ||
                                        "Ocurrió un error al intentar restablecer tu contraseña."}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Link href="/auth/reset-password">
                                <Button>Intentar nuevamente</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                );
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
                    {renderContent()}
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