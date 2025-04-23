// src/components/common/PageHeader.tsx
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
    actions?: ReactNode;
    icon?: LucideIcon;
    badge?: ReactNode;
    variant?: "default" | "gradient" | "subtle" | "minimal";
    backUrl?: string;
}

export function PageHeader({
    title,
    subtitle,
    className,
    actions,
    icon: Icon,
    badge,
    variant = "default",
    backUrl,
}: PageHeaderProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
    };

    const variantClasses = {
        default: "mb-6",
        gradient: "mb-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg px-4",
        subtle: "mb-6 pb-4 border-b",
        minimal: "mb-4",
    };

    const iconContainerClasses = {
        default: "hidden md:flex h-10 w-10 rounded-md bg-primary/10 items-center justify-center text-primary",
        gradient: "hidden md:flex h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 items-center justify-center text-primary-foreground shadow-sm",
        subtle: "hidden md:flex h-10 w-10 rounded-full bg-primary/10 items-center justify-center text-primary",
        minimal: "hidden md:flex h-9 w-9 rounded-md bg-muted items-center justify-center text-muted-foreground",
    };

    const mobileIconClasses = {
        default: "h-6 w-6 text-primary md:hidden",
        gradient: "h-6 w-6 text-primary md:hidden",
        subtle: "h-5 w-5 text-primary md:hidden",
        minimal: "h-5 w-5 text-muted-foreground md:hidden",
    };

    return (
        <motion.div
            className={cn(
                "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
                variantClasses[variant],
                className
            )}
            initial="hidden"
            animate="visible"
            variants={containerVariants}

        >

            <div className="flex items-start gap-3">
                {
                    backUrl && (
                        <Link href="/mis-pagos" passHref>
                            <Button variant="ghost" size="sm" className="mr-2 -ml-3">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Volver
                            </Button>
                        </Link>
                    )
                }
                {Icon && (
                    <motion.div
                        className={iconContainerClasses[variant]}
                        variants={itemVariants}
                    >
                        <Icon className={variant === "gradient" ? "h-6 w-6" : "h-5 w-5"} />
                    </motion.div>
                )}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                            {Icon && <Icon className={mobileIconClasses[variant]} />}
                            {title}
                        </h1>
                        {badge && <div className="ml-2">{badge}</div>}
                    </div>
                    {subtitle && (
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            </div>

            <motion.div
                className="flex items-center gap-2 self-end md:self-auto flex-wrap justify-end"
                variants={itemVariants}
            >
                {actions}
            </motion.div>
        </motion.div>
    );
}