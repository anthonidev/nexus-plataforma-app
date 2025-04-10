import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  profileInfo,
  updateContactInfo,
  updateBillingInfo,
  updateBankInfo,
  updatePersonalInfo,
} from "@/lib/actions/profile/profile.action";
import { getUbigeos } from "@/lib/actions/profile/ubigeo.action";
import {
  ProfileResponse,
  UpdateContactInfoDto,
  UpdateBillingInfoDto,
  UpdateBankInfoDto,
  UpdatePersonalInfoDto,
} from "@/types/profile/profile.type";
import { UbigeoItem } from "@/types/profile/ubigeo.type";

export function useProfile() {
  // Estados para los datos del perfil
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Estado para los ubigeos
  const [ubigeos, setUbigeos] = useState<UbigeoItem[]>([]);
  const [ubigeoLoading, setUbigeoLoading] = useState<boolean>(false);
  const [ubigeoError, setUbigeoError] = useState<string | null>(null);

  // Obtener datos de perfil
  const fetchProfileData = useCallback(async (applyLoading: boolean = true) => {
    try {
      if (applyLoading) {
        setIsLoading(true);
      }
      setError(null);
      const data = await profileInfo();
      setProfile(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar datos del perfil";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (applyLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  // Obtener ubigeos
  const fetchUbigeos = useCallback(async () => {
    try {
      setUbigeoLoading(true);
      setUbigeoError(null);
      const response = await getUbigeos();
      setUbigeos(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar ubigeos";
      setUbigeoError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUbigeoLoading(false);
    }
  }, []);

  // Actualizar información de contacto
  const updateContact = useCallback(
    async (data: UpdateContactInfoDto) => {
      try {
        setIsSaving(true);
        const response = await updateContactInfo(data);

        if (response.success) {
          toast.success(
            response.message || "Información de contacto actualizada"
          );
          await fetchProfileData(false);
        } else {
          toast.error(
            response.message || "Error al actualizar la información de contacto"
          );
        }

        return response.success;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar la información de contacto";
        toast.error(errorMessage);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchProfileData]
  );

  // Actualizar información de facturación
  const updateBilling = useCallback(
    async (data: UpdateBillingInfoDto) => {
      try {
        setIsSaving(true);
        const response = await updateBillingInfo(data);

        if (response.success) {
          toast.success(
            response.message || "Información de facturación actualizada"
          );
          await fetchProfileData(false);
        } else {
          toast.error(
            response.message ||
              "Error al actualizar la información de facturación"
          );
        }

        return response.success;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar la información de facturación";
        toast.error(errorMessage);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchProfileData]
  );

  // Actualizar información bancaria
  const updateBank = useCallback(
    async (data: UpdateBankInfoDto) => {
      try {
        setIsSaving(true);
        const response = await updateBankInfo(data);

        if (response.success) {
          toast.success(response.message || "Información bancaria actualizada");
          await fetchProfileData(false);
        } else {
          toast.error(
            response.message || "Error al actualizar la información bancaria"
          );
        }

        return response.success;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar la información bancaria";
        toast.error(errorMessage);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchProfileData]
  );

  // Actualizar información personal
  const updatePersonal = useCallback(
    async (data: UpdatePersonalInfoDto) => {
      try {
        setIsSaving(true);
        const response = await updatePersonalInfo(data);

        if (response.success) {
          toast.success(response.message || "Información personal actualizada");
          await fetchProfileData(false);
        } else {
          toast.error(
            response.message || "Error al actualizar la información personal"
          );
        }

        return response.success;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar la información personal";
        toast.error(errorMessage);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchProfileData]
  );

  // Encontrar ubigeo por ID
  const findUbigeoById = useCallback(
    (id: number | undefined): UbigeoItem | undefined => {
      if (!id) return undefined;

      // Función de búsqueda recursiva
      const findInList = (items: UbigeoItem[]): UbigeoItem | undefined => {
        for (const item of items) {
          if (item.id === id) return item;
          if (item.children && item.children.length > 0) {
            const found = findInList(item.children);
            if (found) return found;
          }
        }
        return undefined;
      };

      return findInList(ubigeos);
    },
    [ubigeos]
  );

  // Obtener ruta de ubigeo (departamento/provincia/distrito)
  const getUbigeoPath = useCallback(
    (ubigeoId: number | undefined): string => {
      if (!ubigeoId) return "";

      // Encontrar y construir la ruta
      const ubigeo = findUbigeoById(ubigeoId);
      if (!ubigeo) return "";

      const path: string[] = [ubigeo.name];
      let currentParentId = ubigeo.parentId;

      while (currentParentId) {
        const parent = findUbigeoById(currentParentId);
        if (parent) {
          path.unshift(parent.name);
          currentParentId = parent.parentId;
        } else {
          break;
        }
      }

      return path.join(" / ");
    },
    [findUbigeoById]
  );

  // Cargar datos de perfil al montar el componente
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Cargar ubigeos al montar el componente
  useEffect(() => {
    fetchUbigeos();
  }, [fetchUbigeos]);

  return {
    // Datos y estado
    profile,
    isLoading,
    error,
    isSaving,
    ubigeos,
    ubigeoLoading,
    ubigeoError,

    // Acciones
    fetchProfileData,
    fetchUbigeos,
    updateContact,
    updateBilling,
    updateBank,
    updatePersonal,

    // Utilidades
    findUbigeoById,
    getUbigeoPath,
  };
}
