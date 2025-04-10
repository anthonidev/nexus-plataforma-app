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
      className="flex flex-col h-screen sticky top-0 border-r border-gray-800 bg-gray-900 text-gray-100"
    >
      {/* Logo y botón de colapsar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <motion.div
          initial={false}
          animate={{
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : "auto",
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden whitespace-nowrap"
        >
          <Image
            src="/imgs/logo.png"
            alt="Logo"
            width={100}
            height={40}
            className="h-10 w-auto"
          />
        </motion.div>

        {!isMobile && (
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(16, 185, 129, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-emerald-800/20 text-emerald-400 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </motion.button>
        )}
      </div>

      {/* Info del usuario */}
      <div className="p-4 border-b border-gray-800 bg-gray-800/30">
        <div className="flex items-center gap-3">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700"
                  >
                    {user.photo ? (
                      <Image
                        src={user.photo}
                        alt="Foto de perfil"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User size={20} />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex flex-col gap-1 bg-gray-900 border-gray-800"
                >
                  <p className="text-xs text-gray-300">{user.role.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="aspect-square w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700"
            >
              {user.photo ? (
                <Image
                  src={user.photo}
                  alt="Foto de perfil"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User size={20} />
              )}
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
            <span className="font-medium truncate text-white">
              {user.email}
            </span>
            <span className="text-sm text-gray-400 truncate">
              {user.role.name}
            </span>
            {user.nickname && (
              <p className="text-sm text-primary">@{user.nickname}</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-4">
        <motion.div
          className="space-y-1 px-2"
          transition={{ staggerChildren: 0.05 }}
        >
          {user.views.map((item) => (
            <SidebarLink key={item.id} item={item} isCollapsed={isCollapsed} />
          ))}
        </motion.div>
      </nav>

      {/* Cerrar sesión */}
      <motion.div className="p-4 border-t border-gray-800">
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-3 p-2 rounded-lg hover:bg-red-900/20 text-red-400 transition-colors w-full"
                >
                  <LogOut size={20} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-gray-900 border-gray-800"
              >
                <p>Cerrar Sesión</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <motion.button
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(239, 68, 68, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signOut()}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-900/20 text-red-400 transition-colors w-full"
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
