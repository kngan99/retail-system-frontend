import React from 'react';
import { observable, action, makeObservable } from 'mobx';
import adminService from './admin.service';
import { NewAccountDto } from '../account/account.dto';
import { newAdminFormInit } from './admin.constants';

class AdminStore {
    @observable accounts: Account[] = [];
    @observable totalCount: number = 0;
    @observable adminForm: any = newAdminFormInit;
    @observable curUser: any;
  
    @action
    async getAccounts(skip: number, take: number, searchKeyword: string) {
        let data: any = [];
        data = await adminService.getAccounts(skip, take, searchKeyword);
        this.accounts = data[0];
        this.totalCount = data[1];
    }

    @action
    async getAccountById(id: number) {
        const result = await adminService.getAccountById(id);
        this.curUser = result;
        if (result) {
        this.setAdminForm(result);
        }
        return true;
    }

    @action
    async adminVerifyAccount(id: number) {
        const result = await adminService.adminVerifyAccount(id);
        return result;
    }

    @action
    async setAdminForm(data: any) {
        this.adminForm = data;
    }

    @action
    async resetAdminForm() {
        this.adminForm = newAdminFormInit;
    }

    @action
    async addAccount() {
        const data = await adminService.addAccount(this.adminForm);
        return data;
    }

    @action
    async updateAccount(id: number, model: any) {
        const result = await adminService.updateAccount(id, model);
        return result.data?.result;
    }

    @action
    async deleteAccount(id: number) {
        const result = await adminService.deleteAccount(id);
        return result.data?.result;
    }

    @action
    async assignStore(id: number, storeId: number) {
        const result = await adminService.assignStore(id, storeId);
        return result.data;
    }

    @action
    async assignWarehouse(id: number, warehouseId: number) {
        const result = await adminService.assignWarehouse(id, warehouseId);
        return result.data;
    }

    constructor() {
        makeObservable(this);
    }
  }
  
  export default new AdminStore();
  
  export const AdminStoreContext = React.createContext(new AdminStore());
  