export interface AdminMenuDto {
  url: string;
  label: string;
  icon?: string;
  isShow?: boolean;
}

export interface MenuDto {
  url: string;
  label: string;
  icon?: string;
}

export interface ActionBarDto {
  label: string;
  type?: string;
  action: any;
}
