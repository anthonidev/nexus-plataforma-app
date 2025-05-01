export interface RankResponse {
  ranks: Rank[];
  userRank: UserRank;
}

export interface RankBase {
  id: number;
  name: string;
  code: string;
}
export interface Rank extends RankBase {
  requiredPoints: number;
  requiredDirects: number;
}
export interface ProgressRank {
  directsProgress: number;
  volumeProgress: number;
  leftLegDirects: number;
  rightLegDirects: number;
  totalDirects: number;
  requiredDirects: number;
  currentVolume: number;
  requiredVolume: number;
  leftVolume: number;
  rightVolume: number;
}

export interface UserRank {
  currentRank: RankBase;
  highestRank: RankBase;
  nextRank: Rank;
  progress: ProgressRank;
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
