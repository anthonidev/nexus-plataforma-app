import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UpdatePersonalInfoDto } from "@/types/profile/profile.type";
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
import { Loader2 } from "lucide-react";

const personalInfoSchema = z.object({
  documentNumber: z
    .string()
    .min(5, "El número de documento debe tener al menos 5 caracteres")
    .max(20, "El número de documento es demasiado largo")
    .optional(),

  nickname: z
    .string()
    .optional(),
  email: z
    .string()
    .email("El correo electrónico no es válido")
    .optional(),
});

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdatePersonalInfoDto) => Promise<boolean>;
  initialData: {
    documentNumber?: string;
    nickname?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  isSaving: boolean;
}

export default function EditPersonalInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSaving,
}: EditPersonalInfoModalProps) {
  const [success, setSuccess] = useState(false);

  // Configurar formulario con react-hook-form
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      documentNumber: initialData?.documentNumber || "",
      nickname: initialData?.nickname || "",
      email: initialData?.email || "",
    },
  });

  // Manejar envío del formulario
  const handleSubmit = async (data: z.infer<typeof personalInfoSchema>) => {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar información personal</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal. Estos datos son importantes para
            tu identificación en el sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Nombre
                  </label>
                  <p className="text-sm">
                    {initialData?.firstName || "No especificado"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Apellido
                  </label>
                  <p className="text-sm">
                    {initialData?.lastName || "No especificado"}
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de documento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingresa tu número de documento"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem
                  >
                    <FormLabel>Apodo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa tu apodo" {...field}

                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input

                        placeholder="Ingresa tu correo electrónico" {...field} />
                    </FormControl>
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
