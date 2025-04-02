import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UpdateBankInfoDto } from "@/types/profile/profile.type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

// Schema de validación
const bankInfoSchema = z.object({
  bankName: z
    .string()
    .min(2, "El nombre del banco debe tener al menos 2 caracteres")
    .max(100, "El nombre del banco es demasiado largo"),
  accountNumber: z
    .string()
    .min(5, "El número de cuenta debe tener al menos 5 caracteres")
    .max(50, "El número de cuenta es demasiado largo"),
  cci: z
    .string()
    .min(10, "El CCI debe tener al menos 10 caracteres")
    .max(50, "El CCI es demasiado largo")
    .optional(),
});

interface EditBankInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateBankInfoDto) => Promise<boolean>;
  initialData: {
    bankName?: string;
    accountNumber?: string;
    cci?: string;
  } | null;
  isSaving: boolean;
}

export default function EditBankInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSaving,
}: EditBankInfoModalProps) {
  const [success, setSuccess] = useState(false);

  // Configurar formulario con react-hook-form
  const form = useForm<z.infer<typeof bankInfoSchema>>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues: {
      bankName: initialData?.bankName || "",
      accountNumber: initialData?.accountNumber || "",
      cci: initialData?.cci || "",
    },
  });

  // Manejar envío del formulario
  const handleSubmit = async (data: z.infer<typeof bankInfoSchema>) => {
    const result = await onSubmit(data);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar información bancaria</DialogTitle>
          <DialogDescription>
            Actualiza tus datos bancarios para recibir pagos y comisiones.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-xs text-amber-700 dark:text-amber-300">
                Asegúrate que la información bancaria sea correcta. Los pagos se
                realizarán a esta cuenta.
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del banco</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa el nombre de tu banco"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de cuenta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa tu número de cuenta"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Número de cuenta principal para recibir pagos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cci"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CCI (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa tu Código de Cuenta Interbancario"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Código de Cuenta Interbancario para transferencias
                    interbancarias
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving || success}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : success ? (
                  "¡Guardado!"
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
