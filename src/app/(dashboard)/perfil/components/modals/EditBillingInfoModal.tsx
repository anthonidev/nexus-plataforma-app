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
import { UbigeoItem } from "@/types/profile/ubigeo.type";

// Schema de validación
const billingInfoSchema = z.object({
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección es demasiado larga"),
  departmentId: z.number().optional(),
  provinceId: z.number().optional(),
  districtId: z.number().optional(),
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
      code: string;
      parentId?: number;
    } | null;
  } | null;
  isSaving: boolean;
  ubigeos: UbigeoItem[];
  ubigeoLoading: boolean;
  fetchUbigeos: () => void;
}

export default function EditBillingInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSaving,
  ubigeos,
  ubigeoLoading,
  fetchUbigeos,
}: EditBillingInfoModalProps) {
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState<UbigeoItem[]>([]);
  const [provinces, setProvinces] = useState<UbigeoItem[]>([]);
  const [districts, setDistricts] = useState<UbigeoItem[]>([]);

  // Asegurarse de que los ubigeos están cargados
  useEffect(() => {
    if (isOpen && ubigeos.length === 0 && !ubigeoLoading) {
      fetchUbigeos();
    }
  }, [isOpen, ubigeos.length, ubigeoLoading, fetchUbigeos]);

  // Cargar departamentos, provincias y distritos
  useEffect(() => {
    if (ubigeos.length > 0) {
      // Filtrar departamentos (elementos sin parentId)
      const deps = ubigeos.filter((item) => !item.parentId);
      setDepartments(deps);

      // Intentar cargar provincia y distrito si hay un ubigeo inicial
      if (initialData?.ubigeo?.id) {
        loadUbigeoData(initialData.ubigeo.id);
      }
    }
  }, [ubigeos, initialData]);

  // Función para cargar la jerarquía de ubigeos basado en el ID del distrito
  const loadUbigeoData = (districtId: number) => {
    // Buscar el distrito
    const district = findUbigeoById(districtId);
    if (!district || !district.parentId) return;

    // Buscar la provincia
    const province = findUbigeoById(district.parentId);
    if (!province || !province.parentId) return;

    // Buscar el departamento
    const department = findUbigeoById(province.parentId);
    if (!department) return;

    // Establecer provincias basadas en el departamento
    const provincesOfDepartment = department.children || [];
    setProvinces(provincesOfDepartment);

    // Establecer distritos basados en la provincia
    const districtsOfProvince = province.children || [];
    setDistricts(districtsOfProvince);

    // Actualizar los valores del formulario
    form.setValue("departmentId", department.id);
    form.setValue("provinceId", province.id);
    form.setValue("districtId", district.id);
  };

  // Función recursiva para encontrar un ubigeo por ID
  const findUbigeoById = (id: number): UbigeoItem | undefined => {
    const search = (items: UbigeoItem[]): UbigeoItem | undefined => {
      for (const item of items) {
        if (item.id === id) {
          return item;
        }
        if (item.children && item.children.length > 0) {
          const found = search(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return search(ubigeos);
  };

  // Manejar el cambio de departamento
  const handleDepartmentChange = (departmentId: number) => {
    const department = departments.find((d) => d.id === departmentId);
    if (department) {
      setProvinces(department.children || []);
      setDistricts([]);
      form.setValue("provinceId", undefined);
      form.setValue("districtId", undefined);
    }
  };

  // Manejar el cambio de provincia
  const handleProvinceChange = (provinceId: number) => {
    const province = provinces.find((p) => p.id === provinceId);
    if (province) {
      setDistricts(province.children || []);
      form.setValue("districtId", undefined);
    }
  };

  // Configurar formulario con react-hook-form
  const form = useForm<z.infer<typeof billingInfoSchema>>({
    resolver: zodResolver(billingInfoSchema),
    defaultValues: {
      address: initialData?.address || "",
      districtId: initialData?.ubigeo?.id,
    },
  });

  // Manejar envío del formulario
  const handleSubmit = async (data: z.infer<typeof billingInfoSchema>) => {
    // Preparar el DTO para enviar
    const billingData: UpdateBillingInfoDto = {
      address: data.address,
      ubigeoId: data.districtId,
    };

    const result = await onSubmit(billingData);
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
      <DialogContent className="max-w-md">
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

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const numValue = parseInt(value);
                        field.onChange(numValue);
                        handleDepartmentChange(numValue);
                      }}
                      value={field.value?.toString()}
                      disabled={ubigeoLoading || departments.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ubigeoLoading ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Cargando...</span>
                          </div>
                        ) : (
                          departments.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={department.id.toString()}
                            >
                              {department.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="provinceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const numValue = parseInt(value);
                        field.onChange(numValue);
                        handleProvinceChange(numValue);
                      }}
                      value={field.value?.toString()}
                      disabled={provinces.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona provincia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces.length > 0 ? (
                          provinces.map((province) => (
                            <SelectItem
                              key={province.id}
                              value={province.id.toString()}
                            >
                              {province.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">
                            Selecciona un departamento primero
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="districtId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distrito</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={districts.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona distrito" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.length > 0 ? (
                          districts.map((district) => (
                            <SelectItem
                              key={district.id}
                              value={district.id.toString()}
                            >
                              {district.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">
                            Selecciona una provincia primero
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
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
