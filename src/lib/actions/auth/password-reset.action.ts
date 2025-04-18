"use server";

import { createApiUrl } from "@/lib/api";
import { httpClient } from "@/lib/api/http-client";
import {
  RequestResetResponse,
  ResetPasswordResponse,
  VerifyTokenResponse,
} from "@/types/auth/auth.type";

export async function requestPasswordReset(
  email: string
): Promise<RequestResetResponse> {
  try {
    const url = createApiUrl("/api/auth/password-reset/request");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message || "Error al solicitar restablecimiento de contraseña",
      };
    }

    return {
      success: true,
      message:
        data.message ||
        "Se ha enviado un correo para restablecer tu contraseña",
    };
  } catch (error) {
    console.error("Error al solicitar restablecimiento de contraseña:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al solicitar restablecimiento de contraseña",
    };
  }
}

export async function verifyResetToken(
  token: string
): Promise<VerifyTokenResponse> {
  try {
    const url = createApiUrl(`/api/auth/password-reset/verify/${token}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Token inválido o expirado",
      };
    }

    return {
      success: true,
      message: data.message || "Token válido",
      email: data.email,
    };
  } catch (error) {
    console.error("Error al verificar token:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error al verificar token",
    };
  }
}

export async function resetPassword(
  token: string,
  password: string
): Promise<ResetPasswordResponse> {
  try {
    const url = createApiUrl(`/api/auth/password-reset/reset/${token}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Error al restablecer contraseña",
      };
    }

    return {
      success: true,
      message: data.message || "Contraseña restablecida exitosamente",
    };
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al restablecer contraseña",
    };
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ResetPasswordResponse> {
  try {
    return await httpClient("/api/auth/change-password", {
      method: "POST",
      body: {
        currentPassword,
        newPassword,
      },
    });
  } catch (error) {
    throw error;
  }
}
