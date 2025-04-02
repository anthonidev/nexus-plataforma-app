import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UpdateContactInfoDto } from "@/types/profile/profile.type";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";

// Schema de validación
const contactInfoSchema = z.object({
  phone: z
    .string()
    .min(6, "El número de teléfono debe tener al menos 6 caracteres")
    .max(20, "El número de teléfono es demasiado largo"),
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección es demasiado larga")
    .optional(),
  postalCode: z
    .string()
    .max(10, "El código postal es demasiado largo")
    .optional(),
  ubigeoId: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
});

interface EditContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateContactInfoDto) => Promise<boolean>;
  initialData: {
    phone?: string;
    address?: string;
    postalCode?: string;
    ubigeo?: {
      id: number;
      name: string;
    } | null;
  } | null;
  isSaving: boolean;
}

export default function EditContactInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSaving,
}: EditContactInfoModalProps) {
  const [success, setSuccess] = useState(false);
  const { ubigeos, ubigeoLoading, fetchUbigeos } = useProfile();

  // Asegurarse de que los ubigeos están cargados
  useEffect(() => {
    if (isOpen && ubigeos.length === 0 && !ubigeoLoading) {
      fetchUbigeos();
    }
  }, [isOpen, ubigeos.length, ubigeoLoading, fetchUbigeos]);

  // Configurar formulario con react-hook-form
  const form = useForm<z.infer<typeof contactInfoSchema>>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      postalCode: initialData?.postalCode || "",
      ubigeoId: initialData?.ubigeo?.id ? initialData.ubigeo.id : undefined,
    },
  });

  // Manejar envío del formulario
  const handleSubmit = async (data: z.infer<typeof contactInfoSchema>) => {
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
          <DialogTitle>Editar información de contacto</DialogTitle>
          <DialogDescription>
            Actualiza tus datos de contacto y dirección para recibir
            comunicaciones importantes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa tu número de teléfono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa tu dirección completa"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código postal</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingresa tu código postal"
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
                      defaultValue={
                        field.value !== undefined
                          ? String(field.value)
                          : undefined
                      }
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
                            <SelectItem
                              key={ubigeo.id}
                              value={String(ubigeo.id)}
                            >
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
            </div>

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
