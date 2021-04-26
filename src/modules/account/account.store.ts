import React from 'react';
import { observable, action, makeObservable } from 'mobx';
import accountService from './account.service';
import { AdminFilterDto, CreateUserDto } from './account.dto';

class AccountStore {
  @observable accounts: Account[] = [];
  @observable totalCount: number = 0;
  @observable createUserForm: CreateUserDto = {
    email: '',
    password: '',
    homephone: '',
  };
  @observable accountForm: any = {};
  @observable currentUserDetail: any = null;
  @observable deletedAccounts: any[] = [];
  @observable totalDeletedAccounts: number = 0;

  @action
  async getAccounts(skip: number, take: number) {
    let data: any = [];
    data = await accountService.getAccounts(skip, take);
    this.accounts = data[0];
    this.totalCount = data[1];
  }

  @action
  async setCreateUserForm(data: CreateUserDto) {
    this.createUserForm = data;
  }

  @action
  async register() {
    const data = await accountService.register(this.createUserForm);
    return data;
  }

  @action
  async resetCreateUserForm() {
    this.createUserForm = {
      email: '',
      password: '',
      homephone: '',
    };
  }

  @action
  async uploadAvatar(formData: any, id: number) {
    const data = await accountService.uploadAvatar(formData, id);
    return data;
  }

  @action
  async setAccountForm(data: any) {
    this.accountForm = data;
  }

  @action
  async getAccountInfo(id: number) {
    const data = await accountService.getAccountInfo(id);
    this.currentUserDetail = data;
    return data;
  }

  @action
  async updateAccount(id: number) {
    const data = await accountService.updateAccount(this.accountForm, id);
    return data;
  }

  @action
  async deleteAccountFile(id: number, type: number) {
    const data = await accountService.deleteFiles(id, type);
    return data;
  }

  @action
  async restoreAccountByIdByAdmin(id: number) {
    const data = await accountService.restoreAccountByIdByAdmin(id);
    return data;
  }

  @action
  async getDeletedAccountByAdmin(filter: any) {
    const data = await accountService.getDeletedAccountByAdmin(filter);
    const [accounts, count] = data;
    this.deletedAccounts = accounts;
    this.totalDeletedAccounts = count;
    return data;
  }

  constructor() {
    makeObservable(this);
  }
}
  
  export default new AccountStore();
  
  export const AccountStoreContext = React.createContext(new AccountStore());
  