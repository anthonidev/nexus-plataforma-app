import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import SidebarLink from "./SidebarLink";
import Image from "next/image";
type Props = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile?: boolean;
};
const SidebarContent = ({
  isCollapsed,
  setIsCollapsed,
  isMobile = false,
}: Props) => {
  const { data: session } = useSession();
  const user = session?.user;
  if (!user) return null;
  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 256,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="flex flex-col h-screen sticky top-0 border-r border-border bg-layout-sidebar text-layout-sidebar-foreground"
    >
      {}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <motion.span
          initial={false}
          animate={{
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : "auto",
          }}
          transition={{ duration: 0.2 }}
          className="font-bold text-xl overflow-hidden whitespace-nowrap"
        >
          <Image src="/imgs/logo.png" alt="Logo" width={100} height={100} />
        </motion.span>
        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-nav-item-hover transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </motion.button>
        )}
      </div>
      {}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-hover"
                  >
                    {/* {user.photo ? (
                      <Image
                        width={40}
                        height={40}
                        src={user.photo}
                        alt={user.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-primary-foreground" />
                    )} */}

                    <User size={20} className="text-primary-foreground" />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex flex-col gap-1 bg-popover text-popover-foreground"
                >
                  {/* <p className="font-medium">{user.fullName}</p> */}
                  <p className="text-xs text-muted-foreground">
                    {user.role.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="aspect-square w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-hover"
            >
              {/* {user.photo ? (
                <Image
                  width={40}
                  height={40}
                  src={user.photo}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-primary-foreground" />
              )} */}

              <User size={20} className="text-primary-foreground" />
            </motion.div>
          )}
          <motion.div
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : "auto",
            }}
            transition={{ duration: 0.2 }}
            className="flex flex-col overflow-hidden"
          >
            {/* <span className="font-medium truncate">{user.fullName}</span> */}
            <span className="text-sm text-muted-foreground truncate">
              {user.role.name}
            </span>
          </motion.div>
        </div>
      </div>
      {}
      <nav className="flex-1 overflow-y-auto p-4">
        <motion.div
          className="space-y-2"
          transition={{ staggerChildren: 0.05 }}
        >
          {user.views.map((item) => (
            <SidebarLink key={item.id} item={item} isCollapsed={isCollapsed} />
          ))}
        </motion.div>
      </nav>
      {}
      <motion.div className="p-4 border-t border-border space-y-2">
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-destructive/10 transition-colors w-full text-destructive"
                >
                  <LogOut size={20} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-popover text-popover-foreground"
              >
                <p>Cerrar Sesión</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signOut()}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-destructive/10 transition-colors w-full text-destructive"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
export default SidebarContent;
