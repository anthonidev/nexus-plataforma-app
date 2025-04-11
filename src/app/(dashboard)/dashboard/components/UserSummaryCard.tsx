import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface UserSummaryCardProps {
  user: {
    id: string;
    email: string;
    name: string;
    referralCode: string;
    photo: string | null;
  };
}

export default function UserSummaryCard({ user }: UserSummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    toast.success("Código copiado al portapapeles");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="pb-2 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Mi Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div>
              <h3 className="font-medium">{user.name || "Usuario"}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              Código de referido:
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-muted p-2 rounded font-mono text-sm flex-1">
                {user.referralCode}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={copyToClipboard}
              >
                <ClipboardCopy
                  className={`h-4 w-4 ${copied ? "text-green-500" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
