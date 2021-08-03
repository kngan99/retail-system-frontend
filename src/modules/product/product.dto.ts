export interface Product {
  Id: number;
  ProductName: string;
  CategoryId: number;
  QuantityPerUnit: string;
  UnitPrice: number;
  UnitsInStock: number;
  ReorderLevel: number;
  Discontinued: boolean;
  PhotoURL: string;
  Category: any;
  Discount: number;
  StoreProducts: any;
}
