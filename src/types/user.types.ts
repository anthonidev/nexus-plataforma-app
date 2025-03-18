export interface Profile {
  user: UserClient;
  accessToken: string;
  refreshToken: string;
}
export interface UserClient {
  id: string;
  email: string;
  role: Role;
  views: View[];
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
