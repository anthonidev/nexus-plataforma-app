"use client";

import { useCallback, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getUbigeos } from "@/lib/actions/profile/ubigeo.action";
import { registerUser, RegisterData } from "@/lib/actions/auth/register.action";
import { UbigeoItem } from "@/types/profile/ubigeo.type";

export type RegisterFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  gender: "MASCULINO" | "FEMENINO" | "OTRO";
  departmentId?: number;
  provinceId?: number;
  districtId?: number;
  roleCode: string;
};

export function useRegister() {
  const router = useRouter();
  const params = useParams<{ referrerCode: string }>();
  const searchParams = useSearchParams();
  const position = searchParams.get("lado");
  const referrerCode = params.referrerCode;

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para los ubigeos
  const [ubigeos, setUbigeos] = useState<UbigeoItem[]>([]);
  const [departments, setDepartments] = useState<UbigeoItem[]>([]);
  const [provinces, setProvinces] = useState<UbigeoItem[]>([]);
  const [districts, setDistricts] = useState<UbigeoItem[]>([]);

  // Normalizar la posición para asegurar que sea LEFT o RIGHT
  const normalizedPosition = position === "izquierda" ? "LEFT" : "RIGHT";

  // Cargar ubicaciones
  const fetchUbigeos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getUbigeos();
      if (response?.data) {
        setUbigeos(response.data);
        // Filtrar departamentos (sin parentId y tipo 'DEPARTAMENTO' si aplica)
        const deps = response.data.filter((item) => !item.parentId);
        setDepartments(deps);
      }
    } catch (err) {
      toast.error("Error al cargar ubicaciones");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar provincias cuando se selecciona un departamento
  const handleDepartmentChange = useCallback(
    (departmentId: number) => {
      if (!departmentId) return;

      const selectedProvinces = departments.find(
        (item) => item.id === departmentId
      );

      console.log("Selected Provinces:", selectedProvinces?.children);

      setProvinces(selectedProvinces?.children || []);
      setDistricts([]);
    },
    [departments]
  );

  // Actualizar distritos cuando se selecciona una provincia
  const handleProvinceChange = useCallback(
    (provinceId: number) => {
      if (!provinceId) return;

      const selectedDistricts = provinces.find(
        (item) => item.id === provinceId
      );
      console.log("Selected Districts:", selectedDistricts?.children);
      setDistricts(selectedDistricts?.children || []);
    },
    [provinces]
  );

  // Manejar envío del formulario
  const handleSubmit = useCallback(
    async (formData: RegisterFormData): Promise<boolean> => {
      try {
        setIsSubmitting(true);
        setError(null);

        // Validar que se haya seleccionado un distrito
        if (!formData.districtId) {
          toast.error("Debes seleccionar un distrito");
          return false;
        }

        // Preparar datos para enviar al backend
        const registerData: RegisterData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          birthDate: formData.birthDate,
          gender: formData.gender,
          ubigeo: {
            id: formData.districtId,
          },
          referrerCode: referrerCode !== "new" ? referrerCode : undefined,
          roleCode: "CLI", // Establecido a CLI para todos los registros
        };

        // Asignar posición por defecto RIGHT si no está disponible o no es válida
        const validPosition = position === "izquierda" ? "LEFT" : "RIGHT";
        registerData.position = validPosition;

        console.log("Enviando datos de registro:", registerData);

        const response = await registerUser(registerData);

        if (response.success) {
          toast.success(response.message || "Registro exitoso");
          return true;
        } else {
          toast.error(response.message || "Error al registrar");
          setError(response.message || "Error al registrar usuario");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al procesar el registro";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [referrerCode, position]
  );

  return {
    isLoading,
    isSubmitting,
    error,
    referrerCode: referrerCode !== "new" ? referrerCode : undefined,
    position: position === "izquierda" ? "LEFT" : "RIGHT",
    ubigeos,
    departments,
    provinces,
    districts,
    fetchUbigeos,
    handleDepartmentChange,
    handleProvinceChange,
    handleSubmit,
  };
}
