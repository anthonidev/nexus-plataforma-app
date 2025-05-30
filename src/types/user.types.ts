export interface Profile {
  user: UserClient;
  accessToken: string;
  refreshToken: string;
}
export interface UserClient {
  id: string;
  email: string;
  photo?: string;
  nickname?: string;
  firstName: string;
  lastName: string;
  role: Role;
  views: View[];
  membership: Membership;
}
export interface Role {
  id: number;
  code: string;
  name: string;
}
export interface View {
  id: number;
  code: string;
  name: string;
  icon: string;
  url: null | string;
  order: number;
  metadata: null;
  children: View[];
}

export interface Membership {
  hasMembership: boolean;
}
