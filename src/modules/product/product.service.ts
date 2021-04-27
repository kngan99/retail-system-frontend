import http from "../../common/sevices";
import { Product } from "./product.dto";
import { message } from 'antd';

class ProductService {
  productPrefix: string = "http://localhost:4000/api/products";

  public async getOneProduct(id: number) {
    await console.log("is before sending");
    await console.log(id);
    const result = await http.get(`${this.productPrefix}/${id}`, {

    });
    return result.data;
  }

  public async getAllProducts() {
    const result = await http.get(`${this.productPrefix}/`, {

    });
    return result.data;
  }

  public async createProduct(product: Product) {
    console.log("Value before sending")
    console.log(product);
    const result = await http.post(`${this.productPrefix}/`, {
      ...product,
    });
    return result.data;
  }

  public async updateProduct(id: number, product: Product) {
    console.log("Value before sending")
    console.log(product);
    const result = await http.put(`${this.productPrefix}/${id}`, {
      ...product,
    });
    return result.data;
  }

  public async getProductsPagination(skip: number, take: number) {
    const result = await http.get(`${this.productPrefix}/paginateProducts`, {
      params: {
        page: skip,
        limit: take,
      },
    });
    return result.data;
  }

  public async searchProductsPagination(skip: number, take: number, key: string) {
    const result = await http.get(`${this.productPrefix}/searchProducts`, {
      params: {
        page: skip,
        limit: take,
        key: key,
      },
    });
    console.log(result.data)
    return result.data;
  }

  public async deleteProducts(id: number) {
    const result = await http.delete(`${this.productPrefix}/${id}`, {
    });
    return result.data;
  }

  public async getOne(id: number) {
    return new Promise((resolve, reject) => {
      http.get(`${this.productPrefix}/${id}`, {
      }).then((res) => {
        resolve(res);
      })
        .catch((error) => {
          reject(error.response);
        });;
    });
  }
}

export default new ProductService();
