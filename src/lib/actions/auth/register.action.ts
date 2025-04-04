"use server";

import { createApiUrl } from "@/lib/api";

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  gender: "MASCULINO" | "FEMENINO" | "OTRO";
  ubigeo: {
    id: number;
  };
  referrerCode?: string;
  position?: "LEFT" | "RIGHT";
  roleCode: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export async function registerUser(
  data: RegisterData
): Promise<RegisterResponse> {
  try {
    const url = createApiUrl("/api/auth/register");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Error al registrar usuario",
      };
    }

    const result = await response.json();
    return {
      success: true,
      message: result.message || "Usuario registrado exitosamente",
      userId: result.userId,
    };
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al registrar el usuario",
    };
  }
}
