export interface RankResponse {
  ranks: Rank[];
  userRank: UserRank;
  userInfo: UserInfo;
}

export interface Rank {
  id: number;
  name: string;
  code: string;
  requiredPoints: number;
  requiredDirects: number;
  isActive: boolean;
  benefits: null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInfo {
  id: string;
  email: string;
}

export interface UserRank {
  currentRank: Rank;
  highestRank: Rank;
  membershipPlan: MembershipPlan;
}

export interface MembershipPlan {
  id: number;
  name: string;
}

export interface MonthlyVolumenResponse {
  items: Item[];
  meta: Meta;
}

export interface Item {
  id: number;
  totalVolume: number;
  leftVolume: number;
  rightVolume: number;
  leftDirects: number;
  rightDirects: number;
  monthStartDate: string;
  monthEndDate: string;
  status: string;
  metadata: null;
  createdAt: Date;
  updatedAt: Date;
  assignedRank: Rank | null;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
