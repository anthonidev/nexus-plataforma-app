import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { View } from "@/types/user.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Banknote,
  BarChart,
  BarChart2,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  Crown,
  DollarSign,
  History,
  Home,
  Layers,
  Medal,
  PlaneTakeoff,
  Settings,
  Trophy,
  User,
  UserCog,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ICON_MAPPING = {
  // Elementos principales
  dashboard: Home,
  profile: User,
  money: Wallet,
  wallet: CreditCard,

  // Membresía
  membership: Crown,
  "membership-plan": PlaneTakeoff,
  "my-plan": ClipboardCheck,

  // Puntos
  points: Award,
  history: History,
  chart: BarChart,

  // Rangos
  ranks: Medal,
  "all-ranks": Layers,
  "my-ranks": Trophy,

  // Equipo
  team: Users,

  // Admin
  users: UserCog,
  "membership-admin": Settings,
  "payments-admin": DollarSign,
  "withdrawals-admin": Banknote,
  "points-admin": Award,
  "ranks-admin": BarChart2,
  "team-admin": UsersRound,
};

type Props = {
  item: View;
  isCollapsed: boolean;
  isNested?: boolean;
};

const SidebarLink = ({ item, isCollapsed, isNested = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const Icon = ICON_MAPPING[item.icon as keyof typeof ICON_MAPPING] || Home;

  const isActive = item.url && pathname === item.url;

  const isChildActive = item.children?.some(
    (child) => child.url && pathname === child.url
  );

  const LinkContent = () => (
    <motion.div
      className={cn(
        "flex items-center gap-3",
        isCollapsed && "justify-center w-full"
      )}
      initial={false}
      animate={{ x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Icon
        size={20}
        className={cn(
          "transition-colors duration-200",
          isActive || isChildActive ? "text-white" : "text-gray-300"
        )}
      />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "font-medium whitespace-nowrap overflow-hidden transition-colors duration-200",
              isActive || isChildActive ? "text-white" : "text-gray-300"
            )}
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (item.children?.length > 0) {
    const TriggerContent = () => (
      <div
        className={cn(
          "flex items-center w-full",
          !isCollapsed && "justify-between",
          isCollapsed && "justify-center"
        )}
      >
        <LinkContent />
        {!isCollapsed && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "text-gray-400 transition-colors",
              (isActive || isChildActive || isOpen) && "text-white"
            )}
          >
            <ChevronDown size={16} />
          </motion.div>
        )}
      </div>
    );

    const activeStyles =
      isActive || isChildActive
        ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-emerald-400 before:rounded-r-md bg-emerald-900/40 text-white"
        : "";

    return (
      <Collapsible
        open={isOpen || isChildActive}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <div className="w-full">
                <CollapsibleTrigger asChild>
                  <div
                    className={cn(
                      "w-full p-2 rounded-r-md relative transition-all hover:bg-emerald-800/30",
                      activeStyles
                    )}
                  >
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <TriggerContent />
                      </div>
                    </TooltipTrigger>
                  </div>
                </CollapsibleTrigger>
                <TooltipContent
                  side="right"
                  className="flex flex-col gap-1 bg-gray-900 border-gray-800"
                >
                  <p className="font-medium">{item.name}</p>
                  <div className="h-px bg-gray-800 w-full" />
                  <div className="text-xs text-gray-400">
                    Submenú disponible
                  </div>
                </TooltipContent>
              </div>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <CollapsibleTrigger
            className={cn(
              "flex w-full p-2 rounded-r-md relative hover:bg-emerald-800/30 transition-all",
              activeStyles
            )}
          >
            <TriggerContent />
          </CollapsibleTrigger>
        )}
        <CollapsibleContent>
          <AnimatePresence>
            {(isOpen || isChildActive) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "w-full",
                  !isCollapsed && "pl-2",
                  isCollapsed && "border-l border-gray-700"
                )}
              >
                {item.children.map((child) => (
                  <SidebarLink
                    key={child.id}
                    item={child}
                    isCollapsed={isCollapsed}
                    isNested={true}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  const activeStyles = isActive
    ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-emerald-400 before:rounded-r-md bg-emerald-900/40 text-white"
    : "";

  const linkClassName = cn(
    "flex w-full p-2 rounded-r-md relative hover:bg-emerald-800/30 transition-all",
    isCollapsed ? "justify-center" : "items-center gap-3",
    isNested && {
      "ml-2": !isCollapsed,
      "": isCollapsed,
    },
    activeStyles
  );

  const LinkWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      whileHover={{ x: isCollapsed ? 0 : 2 }}
      transition={{ duration: 0.2 }}
      className="w-full overflow-hidden relative"
    >
      {children}
    </motion.div>
  );

  const MainContent = () => (
    <LinkWrapper>
      {item.url ? (
        <Link href={item.url} className={linkClassName}>
          <LinkContent />
        </Link>
      ) : (
        <div className={linkClassName}>
          <LinkContent />
        </div>
      )}
    </LinkWrapper>
  );

  return isCollapsed ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <MainContent />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-gray-900 border-gray-800 text-gray-200"
        >
          <p>{item.name}</p>
          {isNested && (
            <p className="text-xs text-gray-400">Elemento del submenú</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <MainContent />
  );
};

export default SidebarLink;
