// src/components/common/NotificationBadge.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUnreadCount } from "@/lib/actions/notifications/notification.action";

interface NotificationBadgeProps {
    count?: number;
    showNumber?: boolean;
    className?: string;
}

export function NotificationBadge({
    count,
    showNumber = true,
    className = "",
}: NotificationBadgeProps) {
    const [unreadCount, setUnreadCount] = useState<number>(count || 0);
    const [isMounted, setIsMounted] = useState(false);

    // Si no se proporciona count, obtenerlo del API
    useEffect(() => {
        if (count === undefined) {
            // Solo obtener conteo después del montaje
            setIsMounted(true);
        } else {
            setUnreadCount(count);
        }
    }, [count]);

    // Obtener conteo de notificaciones no leídas
    useEffect(() => {
        if (count === undefined && isMounted) {
            const fetchUnreadCount = async () => {
                try {
                    const response = await getUnreadCount();
                    setUnreadCount(response.count);
                } catch (error) {
                    console.error("Error al obtener conteo de notificaciones:", error);
                }
            };

            fetchUnreadCount();

            // Configurar un intervalo para actualizar el conteo periódicamente
            const interval = setInterval(fetchUnreadCount, 30000); // 30 segundos

            return () => clearInterval(interval);
        }
    }, [count, isMounted]);

    // No mostrar si no hay notificaciones
    if (unreadCount === 0) return null;

    return (
        <div className="flex items-center">
            {showNumber && (
                <span className="text-xs font-medium text-muted-foreground mr-1">
                    {unreadCount > 5 ? `+5` : unreadCount}
                </span>
            )}

            <AnimatePresence>
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className={`w-2 h-2 bg-destructive rounded-full relative ${className}`}
                    >
                        <motion.span
                            className="absolute inset-0 rounded-full animate-ping bg-destructive/60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.7, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        />
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
}