import http from "../../common/sevices";

class AdminService {
  accountPrefix: string = "https://warehouse-retail.herokuapp.com/api/accounts";

  public async getAccounts(skip: number, take: number, searchKeyword: string) {
    const result = await http.get(`${this.accountPrefix}/`, {
      params: {
        skip: skip,
        take: take,
        searchKeyword: searchKeyword,
      },
    });
    return result.data;
  }

  public async getAccountById(id: number) {
    const result = await http.get(`${this.accountPrefix}/${id}`);
    console.log(result.data);
    return result.data;
  }

  public async adminVerifyAccount(id: number) {
    const result = await http.put(`${this.accountPrefix}/admin-verify/${id}`);
    return result;
  }

  public async addAccount(model: any) {
    console.log(model);
    const result = await http.post(`${this.accountPrefix}/`, model);
    return result.data;
  }

  public async updateAccount(id: number, model: any) {
    let data = {
      Email: model.email,
      FName: model.fName,
      LName: model.lName,
      Homephone: model.homePhone,
      Type: model.type,
    }
    return await http.put(`${this.accountPrefix}/${id}`, data);
  }  

  public async deleteAccount(id: number) {
    return await http.delete(`${this.accountPrefix}/${id}`);
  }

  public async assignStore(id: number, storeId: number) {
    return await http.put(`${this.accountPrefix}/${id}`, {
      StoreId: storeId,
      WarehouseId: null,
    });
  }  

  public async assignWarehouse(id: number, warehouseId: number) {
    return await http.put(`${this.accountPrefix}/${id}`, {
      WarehouseId: warehouseId,
      StoreId: null,
    });
  }  
}

export default new AdminService();
