import http from "../../common/sevices";

class AccountService {
  accountPrefix: string = "http://localhost:4000/api/accounts";

  public async getAccounts(skip: number, take: number) {
    const result = await http.get(`${this.accountPrefix}/`, {
      params: {
        skip: skip,
        take: take,
      },
    });
    return result.data;
  }
}

export default new AccountService();
