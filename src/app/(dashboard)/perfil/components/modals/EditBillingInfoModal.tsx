import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UpdateBillingInfoDto } from "@/types/profile/profile.type";
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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";

// Schema de validación
const billingInfoSchema = z.object({
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección es demasiado larga"),
  ubigeoId: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
});

interface EditBillingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateBillingInfoDto) => Promise<boolean>;
  initialData: {
    address?: string;
    ubigeo?: {
      id: number;
      name: string;
    } | null;
  } | null;
  isSaving: boolean;
}

export default function EditBillingInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSaving,
}: EditBillingInfoModalProps) {
  const [success, setSuccess] = useState(false);
  const { ubigeos, ubigeoLoading, fetchUbigeos } = useProfile();

  // Asegurarse de que los ubigeos están cargados
  useEffect(() => {
    if (isOpen && ubigeos.length === 0 && !ubigeoLoading) {
      fetchUbigeos();
    }
  }, [isOpen, ubigeos.length, ubigeoLoading, fetchUbigeos]);

  // Configurar formulario con react-hook-form
  const form = useForm<z.infer<typeof billingInfoSchema>>({
    resolver: zodResolver(billingInfoSchema),
    defaultValues: {
      address: initialData?.address || "",
      ubigeoId: initialData?.ubigeo?.id ? initialData.ubigeo.id : undefined,
    },
  });

  // Manejar envío del formulario
  const handleSubmit = async (data: z.infer<typeof billingInfoSchema>) => {
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
          <DialogTitle>Editar información de facturación</DialogTitle>
          <DialogDescription>
            Actualiza tus datos de facturación para recibir documentos
            tributarios correctamente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-xs text-blue-700 dark:text-blue-300">
                Los datos ingresados serán utilizados para la emisión de
                facturas y comprobantes fiscales.
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección de facturación</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa la dirección para facturación"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubigeoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona ubicación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ubigeoLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Cargando...</span>
                        </div>
                      ) : (
                        ubigeos.map((ubigeo) => (
                          <SelectItem key={ubigeo.id} value={String(ubigeo.id)}>
                            {ubigeo.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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
