"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  WithdrawalsInfo,
  WithdrawalsResponse,
} from "@/types/withdrawals/withdrawals.type";

export async function getUserWithdrawals(
  params?: Record<string, unknown> | undefined
): Promise<WithdrawalsResponse> {
  try {
    return await httpClient<WithdrawalsResponse>("/api/withdrawals", {
      params: params,
    });
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getInfoWithdrawals(): Promise<WithdrawalsInfo> {
  try {
    return await httpClient<WithdrawalsInfo>(`/api/withdrawals/info`);
  } catch (error) {
    throw error;
  }
}

export async function createWithdrawal(
  amount: number
): Promise<WithdrawalsResponse> {
  try {
    return await httpClient<WithdrawalsResponse>(`/api/withdrawals`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  } catch (error) {
    throw error;
  }
}
