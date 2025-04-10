"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  ApiResponse,
  ProfileResponse,
  UpdateBankInfoDto,
  UpdateBillingInfoDto,
  UpdateContactInfoDto,
  UpdatePersonalInfoDto,
} from "@/types/profile/profile.type";

export async function profileInfo(): Promise<ProfileResponse> {
  try {
    return await httpClient<ProfileResponse>("/api/profile", {
      method: "GET",
    });
  } catch (error) {
    console.error("Error al actualizar información de contacto:", error);
    throw error;
  }
}

export async function updateContactInfo(
  updateContactInfoDto: UpdateContactInfoDto
): Promise<ApiResponse> {
  try {
    return await httpClient<ApiResponse>("/api/profile/contact-info", {
      method: "PUT",
      body: updateContactInfoDto,
    });
  } catch (error) {
    console.error("Error al actualizar información de contacto:", error);
    throw error;
  }
}

export async function updateBillingInfo(
  updateBillingInfoDto: UpdateBillingInfoDto
): Promise<ApiResponse> {
  try {
    return await httpClient<ApiResponse>("/api/profile/billing-info", {
      method: "PUT",
      body: updateBillingInfoDto,
    });
  } catch (error) {
    console.error("Error al actualizar información de facturación:", error);
    throw error;
  }
}

export async function updateBankInfo(
  updateBankInfoDto: UpdateBankInfoDto
): Promise<ApiResponse> {
  try {
    return await httpClient<ApiResponse>("/api/profile/bank-info", {
      method: "PUT",
      body: updateBankInfoDto,
    });
  } catch (error) {
    console.error("Error al actualizar información bancaria:", error);
    throw error;
  }
}

export async function updatePersonalInfo(
  updatePersonalInfoDto: UpdatePersonalInfoDto
): Promise<ApiResponse> {
  try {
    return await httpClient<ApiResponse>("/api/profile/personal-info", {
      method: "PUT",
      body: updatePersonalInfoDto,
    });
  } catch (error) {
    console.error("Error al actualizar información personal:", error);
    throw error;
  }
}

export async function updateProfilePhoto(
  formData: FormData
): Promise<ApiResponse> {
  try {
    return await httpClient<ApiResponse>("/api/profile/photo", {
      method: "PUT",
      body: formData,
    });
  } catch (error) {
    console.error("Error al actualizar foto de perfil:", error);
    throw error;
  }
}
