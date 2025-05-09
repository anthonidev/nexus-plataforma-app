export interface MembershipByDay {
  date: Date;
  Ejecutivo: number;
  Premium: number;
  VIP: number;
}
export interface TotalMembershipByPlan {
  Premium: number;
  VIP: number;
  Ejecutivo: number;
}

export interface OrdersByDay {
  date: Date;
  cantidad: number;
}

export interface PaymentsByConcepts {
  date: Date;
  membresia: number;
  upgrade: number;
  reconsumo: number;
  orden: number;
}

export interface TotalUsersByState {
  total: number;
  activos: number;
  inactivos: number;
  pendientes: number;
  expirados: number;
  "sin membresia": number;
}
export interface UsersCreatedByData {
  date: Date;
  cantidad: number;
}

export interface TotalUserByRank {
  [key: string]: number;
}
