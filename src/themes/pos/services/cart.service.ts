import http from "../../../common/sevices";
import { message } from 'antd';
import { OrderListDto } from "./list.dto";
import { prepareGetQuery } from "../../../common/utils/routes.util";

interface CashierInfo {
  Salesclerk: any;
  Session: any;
}

class CartService {
  sessionPrefix: string = "https://warehouse-retail.herokuapp.com/api/sessions";
  cargoRequestPrefix: string = "https://warehouse-retail.herokuapp.com/api/cargo-requests"

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

  public async getPastSessions(skip: number, take: number, id: number) {
    const result = await http.get(`${this.sessionPrefix}/past`, {
      params: {
        page: skip,
        limit: take,
        id: id,
      },
    });
    return result.data;
  }

  public async getPastStores(id: number) {
    const result = await http.get(`${this.sessionPrefix}/multistores`, {
      params: {
        id: id,
      },
    });
    return result.data;
  }

  public async getSessionDetail(id: string) {
    const result = await http.get(`${this.sessionPrefix}/${id}`, {
    });
    return result.data;
  }

  public async createCargoRequest(model: any) {
    const result = await http.post(`${this.cargoRequestPrefix}/`, model);
    return result;
  }

  public async updateCargoRequest(id: number, model: any) {
    const result = await http.put(`${this.cargoRequestPrefix}/${id}`, model);
    return result;
  }

  public async adminDeleteOrder(id: number) {
    const result = await http.delete(`${this.cargoRequestPrefix}/${id}`);
    return result;
  }

  public async cancelCargoReq(id: number) {
    const result = await http.put(`${this.cargoRequestPrefix}/${id}/Cancelled`);
    return result;
  }

  public async updateStatusCargoReq(id: number, status: string) {
    const result = await http.put(`${this.cargoRequestPrefix}/${id}/${status}`);
    return result;
  }

  public async getCargoReqStatus(id: number) {
    const result = await http.get(`${this.cargoRequestPrefix}/${id}/status`);
    return result;
  }

  public async getOrderListByAdmin(criteria: OrderListDto) {
    return await http.get(
      `${this.cargoRequestPrefix}${prepareGetQuery({ ...criteria })}`
    );
  }

  async getOrderByID(id: number) {
    const result = await http.get(`${this.cargoRequestPrefix}/${id}`);
    return result.data;
  }

  public async getAllCashiers() {
    const result = await http.get(`${this.sessionPrefix}/allCashiers`);
    return result.data;
  }

}

export default new CartService();
