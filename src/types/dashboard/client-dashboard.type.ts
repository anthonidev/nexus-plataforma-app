export interface DashboardClient {
  user: User;
  membership: Membership;
  points: Points;
  weeklyVolume: WeeklyVolume;
  monthlyVolume: MonthlyVolume;
  rank: Rank;
  network: Network;
}

export interface Membership {
  id: number;
  plan: Plan;
  startDate: Date;
  endDate: Date;
  nextReconsumptionDate: Date;
  autoRenewal: boolean;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  binaryPoints: number;
}

export interface MonthlyVolume {
  leftVolume: number;
  rightVolume: number;
  totalVolume: number;
  leftDirects: number;
  rightDirects: number;
  totalDirects: number;
  monthStartDate: Date;
  monthEndDate: Date;
}

export interface Network {
  directReferrals: DirectReferrals;
  networkSize: number;
  leftLegCount: number;
  rightLegCount: number;
}

export interface DirectReferrals {
  totalCount: number;
  activeCount: number;
  leftCount: number;
  rightCount: number;
}

export interface Points {
  availablePoints: number;
  totalEarnedPoints: number;
  totalWithdrawnPoints: number;
}

export interface Rank {
  current: Current;
  highest: Current;
}

export interface Current {
  id: number;
  name: string;
  code: string;
  requiredPoints: number;
  requiredDirects: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  referralCode: string;
  photo: null;
}

export interface WeeklyVolume {
  leftVolume: number;
  rightVolume: number;
  total: number;
  weekStartDate: Date;
  weekEndDate: Date;
}
