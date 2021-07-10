import http from "../../../common/sevices";
import { message } from 'antd';

class CustomerService {
  sessionPrefix: string = "https://warehouse-retail.herokuapp.com/api/customers";

  public async searchCustomers(key: string) {
    const result = await http.get(`${this.sessionPrefix}/search`, {
      params: { key: key }
    });
    return result.data;
  }

  public async createCustomer(customer: any) {
    console.log("Value before sending")
    console.log(customer);
    const result = await http.post(`${this.sessionPrefix}/`, {
      ...customer,
    });
    return result.data;
  }

}

export default new CustomerService();
