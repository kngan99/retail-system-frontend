export interface OrderListDto {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
    order?: any;
    searchBy?: string;
    searchKeyword?: string;
  }