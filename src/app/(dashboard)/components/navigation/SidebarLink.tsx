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
  ChevronDown,
  FileText,
  Home,
  Map,
  Podcast,
  SquareUserRound,
  TableProperties,
  User,
  UserPlus,
  UserRoundCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
const ICON_MAPPING = {
  profile: User,
  project: FileText,
  lote: Map,
  user: Users,
  lead: Home,
  "g-lead": SquareUserRound,
  "lead-source": Podcast,
  "new-lead": UserPlus,
  leads: TableProperties,
  liner: UserRoundCheck,
};
type Props = {
  item: View;
  isCollapsed: boolean;
  isNested?: boolean;
};
const SidebarLink = ({ item, isCollapsed, isNested = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = ICON_MAPPING[item.icon as keyof typeof ICON_MAPPING] || Home;
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
      <Icon size={20} />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="font-medium whitespace-nowrap overflow-hidden"
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
          >
            <ChevronDown size={16} />
          </motion.div>
        )}
      </div>
    );
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <div className="w-full">
                <CollapsibleTrigger asChild>
                  <div className="w-full p-2 rounded-lg hover:bg-nav-item-hover transition-colors">
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <TriggerContent />
                      </div>
                    </TooltipTrigger>
                  </div>
                </CollapsibleTrigger>
                <TooltipContent
                  side="right"
                  className="flex flex-col gap-1 bg-popover text-popover-foreground"
                >
                  <p className="font-medium">{item.name}</p>
                  <div className="h-px bg-border w-full" />
                  <div className="text-xs text-muted-foreground">
                    Submenú disponible
                  </div>
                </TooltipContent>
              </div>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <CollapsibleTrigger className="flex w-full p-2 rounded-lg hover:bg-nav-item-hover transition-colors">
            <TriggerContent />
          </CollapsibleTrigger>
        )}
        <CollapsibleContent>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "w-full",
                  !isCollapsed && "pl-4",
                  isCollapsed && "border-l-2 border-border"
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
  const linkClassName = cn(
    "flex w-full p-2 rounded-lg hover:bg-nav-item-hover transition-colors",
    isCollapsed ? "justify-center" : "items-center gap-3",
    isNested && {
      "ml-4": !isCollapsed,
      "": isCollapsed,
    }
  );
  const LinkWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      whileHover={{ x: isCollapsed ? 0 : 4 }}
      transition={{ duration: 0.2 }}
      className="w-full"
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
          className="bg-popover text-popover-foreground"
        >
          <p>{item.name}</p>
          {isNested && (
            <p className="text-xs text-muted-foreground">
              Elemento del submenú
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <MainContent />
  );
};
export default SidebarLink;
