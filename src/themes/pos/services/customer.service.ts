import http from "../../../common/sevices";
import { message } from 'antd';

class CustomerService {
  sessionPrefix: string = "http://localhost:4000/api/customers";

  public async searchCustomers(key: string) {
    const result = await http.get(`${this.sessionPrefix}/search`, {
      params: { key: key }
    });
    return result.data;
  }

}

export default new CustomerService();
