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
  weekStartDate: Date;
  weekEndDate: Date;
  status: "PENDING" | "PROCESSED" | "CANCELLED";
  paidAmount?: number;
  selectedSide?: "LEFT" | "RIGHT";
  carryOverVolume: number;
  membershipPlan?: {
    id: number;
    name: string;
  };
  createdAt: Date;
}
