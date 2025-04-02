export interface UbigeoItem {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
  children?: UbigeoItem[];
}

export interface UbigeoResponse {
  success: boolean;
  data: UbigeoItem[];
}
