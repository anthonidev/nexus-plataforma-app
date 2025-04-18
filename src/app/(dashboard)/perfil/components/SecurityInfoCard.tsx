// src/app/(dashboard)/perfil/components/SecurityInfoCard.tsx
import { Button } from "@/components/ui/button";
import { Edit, ShieldAlert, Key, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SecurityInfoCardProps {
    onChangePassword: () => void;
}

export default function SecurityInfoCard({
    onChangePassword,
}: SecurityInfoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative"
        >
            <div className="flex flex-row justify-between items-start w-full mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldAlert size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-medium text-lg">Seguridad</h3>
                        <p className="text-sm text-muted-foreground">
                            Administra la seguridad de tu cuenta
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4 mt-2">
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                        Tu cuenta está protegida
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex flex-col gap-2 p-3 bg-background/80 dark:bg-gray-800/50 rounded-md">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm font-medium">Contraseña</p>
                                    <p className="text-xs text-muted-foreground">
                                        Actualiza tu contraseña periódicamente para mayor seguridad
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onChangePassword}
                                className="flex gap-2 items-center"
                            >
                                <Edit className="h-4 w-4" />
                                <span>Cambiar</span>
                            </Button>
                        </div>
                    </div>

                    <div className="border-t border-border/50 pt-3 mt-3">
                        <p className="text-xs text-muted-foreground">
                            Última actualización de contraseña: Desconocida
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}