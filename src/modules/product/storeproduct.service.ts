import http from "../../common/sevices";
import { Product } from "./product.dto";
import { message } from 'antd';

class StoreProductService {
  storeproductPrefix: string = "http://localhost:4000/api/storeproducts";

  public async addProduct(id: number) {
    const result = await http.post(`${this.storeproductPrefix}/${id}`, {
    });
    return result.data;
  }
}

export default new StoreProductService();
