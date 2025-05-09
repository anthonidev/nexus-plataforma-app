"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  MembershipByDay,
  OrdersByDay,
  PaymentsByConcepts,
  TotalMembershipByPlan,
  TotalUserByRank,
  TotalUsersByState,
  UsersCreatedByData,
} from "@/types/dashboard/charts.type";
import { DashboardClient } from "@/types/dashboard/client-dashboard.type";

export async function getMyClientDashboard(): Promise<DashboardClient> {
  try {
    return await httpClient<DashboardClient>("/api/dashboard-users/all-data");
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getMembershipByDay(
  params?: Record<string, unknown> | undefined // startDate and endDate
): Promise<MembershipByDay[]> {
  try {
    return await httpClient<MembershipByDay[]>(
      `/api/dashboard-memberships/memberships-by-day`,
      { params: params }
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getTotalMembershipByPlan(): Promise<TotalMembershipByPlan> {
  try {
    return await httpClient<TotalMembershipByPlan>(
      `/api/dashboard-memberships/total-memberships-by-plan`
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getOrdersByDay(
  params?: Record<string, unknown> | undefined // startDate and endDate
): Promise<OrdersByDay[]> {
  try {
    return await httpClient<OrdersByDay[]>(
      `/api/dashboard-orders/orders-by-day`,
      { params: params }
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getPaymentsByConcepts(
  params?: Record<string, unknown> | undefined // startDate and endDate
): Promise<PaymentsByConcepts[]> {
  try {
    return await httpClient<PaymentsByConcepts[]>(
      `/api/dashboard-payments/payments-by-concepts`,
      { params: params }
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getTotalUsersByState(): Promise<TotalUsersByState> {
  try {
    return await httpClient<TotalUsersByState>(
      `/api/dashboard-users/total-users-by-state`
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getUsersCreatedByDate(
  params?: Record<string, unknown> | undefined // startDate and endDate
): Promise<UsersCreatedByData[]> {
  try {
    return await httpClient<UsersCreatedByData[]>(
      `/api/dashboard-users/users-created-by-date`,
      { params: params }
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getTotalUserByRank(): Promise<TotalUserByRank> {
  try {
    return await httpClient<TotalUserByRank>(
      `/api/dashboard-users/total-users-by-range`
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}
