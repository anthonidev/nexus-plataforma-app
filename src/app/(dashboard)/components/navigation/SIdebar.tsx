"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";

import SidebarContent from "./SidebarContent";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <>
      <AnimatePresence>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg shadow-md "
            >
              <Menu size={20} />
            </motion.button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r-0 ">
            <SheetHeader className="sr-only">
              <SheetTitle>Menú de navegación</SheetTitle>
            </SheetHeader>
            <SidebarContent
              isCollapsed={false}
              setIsCollapsed={() => {}}
              isMobile={true}
            />
          </SheetContent>
        </Sheet>
      </AnimatePresence>
      {}
      <div className="hidden lg:block">
        <SidebarContent
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={false}
        />
      </div>
    </>
  );
};
export default Sidebar;
