import http from "../../common/sevices";
import { removeConfirmationFields } from "../../common/utils/apis.util";
import { prepareGetQuery } from "../../common/utils/routes.util";
import { CreateUserDto } from "./account.dto";
import { DEFAULT_API } from "./router.enum";

class AccountService {
  accountPrefix: string = DEFAULT_API.PREFIX;

  public async getAccounts(skip: number, take: number) {
    console.log("debug");
    const result = await http.get(`${this.accountPrefix}/`, {
      params: {
        skip: skip,
        take: take,
      },
    });
    return result.data;
  }

  public async register(model: CreateUserDto) {
    const excludedModel = removeConfirmationFields(model);
    const result = await http.post(
      `${this.accountPrefix}/`,
      excludedModel
    );
    return result.data;
  }

  public async uploadAvatar(data: any, id: number) {
    const form = new FormData();
    form.append('image', data);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const result = await http.post(
      `${this.accountPrefix}/${id}/upload-profile-img`,
      form,
      config
    );
    return result.data;
  }

  public async deleteFiles(id: number, type: number) {
    const result = await http.delete(`${this.accountPrefix}/files/${id}/${type}`);
    return result.data?.result;
  }

  public async getAccountInfo(id: number) {
    const result = await http.get(`${this.accountPrefix}/${id}`);
    return result.data;
  }

  public async updateAccount(model: any, id: number) {
    const result = await http.put(`${this.accountPrefix}/${id}`, model);
    return result.data;
  }

  public async restoreAccountByIdByAdmin(id: number) {
    const result = await http.post(`${this.accountPrefix}/${id}/restore`);
    return result.data;
  }

  public async getDeletedAccountByAdmin(criteria: any) {
    const result = await http.get(
      `${this.accountPrefix}/deleted${prepareGetQuery({ ...criteria })}`
    );
    return result.data;
  }
}

export default new AccountService();
