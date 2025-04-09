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
