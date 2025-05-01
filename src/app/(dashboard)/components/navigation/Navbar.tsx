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
import NotificationIcon from "@/components/common/NotificationIcon";
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
        <NotificationIcon />

        <Separator orientation="vertical" className="h-6 bg-border" />
        <ThemeSwitch />
      </div>
    </motion.nav>
  );
};
export default Navbar;
