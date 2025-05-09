export interface WeeklyVolumesResponse {
  items: WeeklyVolumeItem[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface WeeklyVolumeItem {
  id: number;
  leftVolume: number;
  rightVolume: number;

  weekStartDate: string;
  weekEndDate: string;

  status: "PENDING" | "PROCESSED" | "CANCELLED";

  paidAmount: number | null;
  selectedSide: "LEFT" | "RIGHT" | null;
  carryOverVolume: number;
  createdAt: Date;

  metadata: Record<string, any> | null;
}

export interface DetailVolumeResponse {
  id: number;
  leftVolume: number;
  rightVolume: number;
  weekStartDate: Date;
  weekEndDate: Date;
  status: "PENDING" | "PROCESSED" | "CANCELLED";

  paidAmount: null;
  selectedSide: "LEFT" | "RIGHT" | null;
  carryOverVolume: number;
  createdAt: Date;
  metadata: Record<string, any> | null;
  weeklyVolumesHistory: WeeklyVolumesHistory;
}

export interface WeeklyVolumesHistory {
  items: Item[];
  meta: Meta;
}

export interface Item {
  id: string;
  selectedSide: "LEFT" | "RIGHT";
  volume: number;
  createdAt: Date;
  updatedAt: Date;
  payment: Payment;
}

export interface Payment {
  id: number;
  amount: number;
  methodPayment: string;
  codeOperation: null | string;
  banckName: null | string;
  dateOperation: Date | null;
  numberTicket: null | string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
