import http from "../../../common/sevices";
import { message } from 'antd';

interface CashierInfo {
  Salesclerk: any;
  Session: any;
}

class CartService {
  sessionPrefix: string = "http://localhost:4000/api/sessions";

  public async startNewSession() {
    const result = await http.post(`${this.sessionPrefix}`, {
    });
    return result.data;
  }

  public async endSession(id: string) {
    const result = await http.post(`${this.sessionPrefix}/${id}`, {
    });
    return result.data;
  }

  public async getCashierInfo() {
    const result = await http.get(`${this.sessionPrefix}/`, {
    });
    return result.data;
  }

}

export default new CartService();
