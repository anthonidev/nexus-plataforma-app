"use client";
import NavbarCartIcon from "@/components/common/NavbarCartIcon";
import NotificationIcon from "@/components/common/NotificationIcon";
import PointsIcon from "@/components/common/PointsIcon";
import ThemeSwitch from "@/components/common/ThemeSwich";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const Navbar = () => {

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
        <PointsIcon />

        <NavbarCartIcon />
        <NotificationIcon />
        <Separator orientation="vertical" className="h-6 bg-border" />
        <ThemeSwitch />
      </div>
    </motion.nav>
  );
};
export default Navbar;