"use server";

import { httpClient } from "@/lib/api/http-client";
import { FinanceWithdrawals } from "@/types/withdrawals/finance-withdrawals.type";

export async function getAllWithdrawals(
  params?: Record<string, unknown> | undefined
): Promise<FinanceWithdrawals> {
  try {
    return await httpClient<FinanceWithdrawals>("/api/finance/withdrawals", {
      params: params,
    });
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function approveWithdrawal(
  withdrawalId: number,
  approvalData: {
    codeOperation: string;
    banckNameApproval: string;
    dateOperation: string;
    numberTicket: string;
  }
): Promise<FinanceWithdrawals> {
  try {
    return await httpClient<FinanceWithdrawals>(
      `/api/finance/withdrawals/approval/${withdrawalId}/approve`,
      {
        method: "POST",
        body: approvalData,
      }
    );
  } catch (error) {
    console.error("Error al aprobar el retiro:", error);
    throw error;
  }
}

export async function rejectWithdrawal(
  withdrawalId: number,
  rejectionReason: string
): Promise<FinanceWithdrawals> {
  try {
    return await httpClient<FinanceWithdrawals>(
      `/api/finance/withdrawals/approval/${withdrawalId}/reject`,
      {
        method: "POST",
        body: {
          rejectionReason,
        },
      }
    );
  } catch (error) {
    console.error("Error al rechazar el retiro:", error);
    throw error;
  }
}
