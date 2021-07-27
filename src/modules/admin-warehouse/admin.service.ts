import http from "../../common/sevices";

class AdminService {
  accountPrefix: string = "http://localhost:4000/api/accounts/warehouse";

  public async getAccounts(skip: number, take: number) {
    const result = await http.get(`${this.accountPrefix}/all`, {
      params: {
        skip: skip,
        take: take,
      },
    });
    return result.data;
  }
  public async getWarehousesAllDb() {
    const result = await http.get(`${this.accountPrefix}/all-db`);
    return result.data;
  }

  public async getAccountById(id: number) {
    const result = await http.get(`${this.accountPrefix}/${id}`);
    return result.data;
  }

  public async addAccount(model: any) {
    const result = await http.post(`${this.accountPrefix}/`, model);
    return result.data;
  }

  public async updateAccount(id: number, model: any) {
    return await http.put(`${this.accountPrefix}/${id}`, model);
  }  

  public async deleteAccount(id: number) {
    return await http.delete(`${this.accountPrefix}/${id}`);
  }
}

export default new AdminService();
