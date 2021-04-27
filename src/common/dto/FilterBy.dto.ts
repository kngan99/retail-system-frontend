export interface FilterByOptions {
  key: any;
  label: string;
}

export interface FilterByDto {
  key: string;
  label: string;
  type?: any;
  options?: FilterByOptions[];
}
