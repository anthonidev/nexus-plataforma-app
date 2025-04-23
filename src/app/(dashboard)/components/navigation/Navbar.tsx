"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Bell, Calendar } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import ThemeSwitch from "@/components/common/ThemeSwich";
const Navbar = () => {
  const [notifications] = useState([
    { id: 1, text: "Nueva propiedad agregada", time: "Hace 5 min" },
    { id: 2, text: "Actualización de proyecto", time: "Hace 30 min" },
  ]);
  const formatDate = () => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  };
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className=" border-b border-border bg-layout-topbar text-layout-topbar-foreground px-6 flex items-center justify-between shadow-sm p-3"
    >
      { }
      <div className="flex items-center space-x-4 ml-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-medium capitalize text-muted-foreground flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-lg"
        >
          <Calendar size={15} className="text-muted-foreground" />
          {formatDate()}
        </motion.div>
      </div>
      <div className="flex items-center gap-4">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors outline-none"
            >
              <Bell size={20} className="text-muted-foreground" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full">
                  <span className="absolute inset-0 rounded-full animate-ping bg-destructive/60" />
                </span>
              )}
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-popover text-popover-foreground"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium">Notificaciones</span>
              {notifications.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {notifications.length} nuevas
                </span>
              )}
            </div>
            <Separator className="bg-border" />
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification, index) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 px-3 py-2 cursor-pointer focus:bg-secondary/80 hover:bg-secondary/80"
                  >
                    <span className="font-medium">{notification.text}</span>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                    {index !== notifications.length - 1 && (
                      <Separator className="bg-border/50 mt-2" />
                    )}
                  </DropdownMenuItem>
                ))}
                <Separator className="bg-border" />
                <DropdownMenuItem className="p-2 text-center text-sm text-primary hover:bg-secondary/80 cursor-pointer">
                  Ver todas las notificaciones
                </DropdownMenuItem>
              </>
            ) : (
              <div className="p-4 text-sm text-center text-muted-foreground">
                No hay notificaciones
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu> */}
        <Separator orientation="vertical" className="h-6 bg-border" />
        <ThemeSwitch />
      </div>
    </motion.nav>
  );
};
export default Navbar;
