import { Button } from "@/components/ui/button";
import {
  Copy,
  Share,
  Link,
  ArrowLeft,
  ArrowRight,
  Gift,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReferralInfoCardProps {
  referralCode: string;
}

export default function ReferralInfoCard({
  referralCode,
}: ReferralInfoCardProps) {
  const [activeTab, setActiveTab] = useState<string>("izquierda");
  const [copying, setCopying] = useState(false);

  const getShareUrl = (side: string) => {
    return `${window.location.origin}/register/${referralCode}?lado=${side}`;
  };

  const copyToClipboard = (side: string) => {
    setCopying(true);
    const url = getShareUrl(side);

    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success(`Link copiado al portapapeles`, {
          duration: 1500,
        });

        setTimeout(() => setCopying(false), 1500);
      })
      .catch((err) => {
        toast.error("Error al copiar el link", {
          description: "No se pudo copiar el link al portapapeles",
        });
        setCopying(false);
      });
  };

  const shareReferral = (side: string) => {
    const url = getShareUrl(side);
    const title = `Únete a mi equipo (${side})`;
    const text = `Únete a mi organización usando mi código de referido: ${referralCode} (lado ${side})`;

    if (navigator.share) {
      navigator
        .share({
          title,
          text,
          url,
        })
        .catch((error) => {
          toast.error("Error al compartir el link", {
            description: "No se pudo compartir el link",
          });
        });
    } else {
      copyToClipboard(side);
    }
  };

  const openReferralLink = (side: string) => {
    const url = getShareUrl(side);
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative"
    >
      <div className="flex flex-row justify-between items-start w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Gift size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">Código de Referido</h3>
            <p className="text-sm text-muted-foreground">
              Comparte tu código en ambos lados
            </p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4 mt-2">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Selecciona el lado para referir nuevos miembros:
          </p>

          <Tabs
            defaultValue="izquierda"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-2 w-full mb-4 dark:bg-gray-800 dark:border-gray-700 dark:border">
              <TabsTrigger
                value="izquierda"
                className="flex items-center gap-1 data-[state=active]:dark:bg-gray-700 data-[state=active]:dark:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Izquierda</span>
              </TabsTrigger>
              <TabsTrigger
                value="derecha"
                className="flex items-center gap-1 data-[state=active]:dark:bg-gray-700 data-[state=active]:dark:text-white"
              >
                <span>Derecha</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="izquierda" className="space-y-3">
              <div className="bg-primary/10 dark:bg-primary/5 rounded-md p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate flex-1">
                  <Link className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-xs truncate">
                    {getShareUrl("izquierda")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard("izquierda")}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-center dark:border-gray-700"
                  onClick={() => shareReferral("izquierda")}
                >
                  <Share className="h-4 w-4" />
                  <span>Compartir</span>
                </Button>

                <Button
                  variant="default"
                  className="flex items-center gap-2 justify-center"
                  onClick={() => openReferralLink("izquierda")}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Abrir link</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="derecha" className="space-y-3">
              <div className="bg-primary/10 dark:bg-primary/5 rounded-md p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate flex-1">
                  <Link className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-xs truncate">
                    {getShareUrl("derecha")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard("derecha")}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-center dark:border-gray-700"
                  onClick={() => shareReferral("derecha")}
                >
                  <Share className="h-4 w-4" />
                  <span>Compartir</span>
                </Button>

                <Button
                  variant="default"
                  className="flex items-center gap-2 justify-center"
                  onClick={() => openReferralLink("derecha")}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Abrir link</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
