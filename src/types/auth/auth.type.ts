export interface RequestResetResponse {
  success: boolean;
  message: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  message: string;
  email?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
