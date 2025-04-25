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
