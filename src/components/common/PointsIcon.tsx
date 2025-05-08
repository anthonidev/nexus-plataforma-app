"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatCurrency } from "@/utils/format-currency.utils";
import { usePointsUser } from '@/hooks/usePointsUser';
import { Coins, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const PointsIcon = () => {
    const { points, isLoading, refreshPoints } = usePointsUser();

    const handleRefresh = () => {
        refreshPoints();
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <motion.div
                    className="relative flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        variant="ghost"
                        className="relative h-10 px-3 rounded-full gap-2 flex items-center"
                    >
                        <Coins size={18} className="text-primary" />
                        <span className="font-medium text-sm">
                            {isLoading ? '...' : formatCurrency(points.availablePoints, "PEN")}
                        </span>
                    </Button>
                </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="flex items-center justify-between border-b p-3 bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-primary" />
                        <span className="font-medium">Mis Puntos</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Puntos disponibles</span>
                            <motion.div
                                key={points.availablePoints}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-2xl font-bold text-primary">
                                    {isLoading ? '...' : formatCurrency(points.availablePoints, "PEN")}
                                </span>
                            </motion.div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Aprovecha tus puntos para retirarlos como comisiones
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Puntos generados</span>
                            <span className="text-sm font-medium">
                                {isLoading ? '...' : formatCurrency(points.totalEarnedPoints, "PEN")}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Puntos retirados</span>
                            <span className="text-sm font-medium">
                                {isLoading ? '...' : formatCurrency(points.totalWithdrawnPoints, "PEN")}
                            </span>
                        </div>
                        {points.membershipPlan && (
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Plan actual</span>
                                <span className="text-sm font-medium">{points.membershipPlan.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-4 flex gap-2">
                        <Link href="/historial-puntos" className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                                Ver historial
                            </Button>
                        </Link>
                        <Link href="/solicitar-retiro" className="flex-1">
                            <Button size="sm" className="w-full">
                                Solicitar retiro
                            </Button>
                        </Link>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default PointsIcon;