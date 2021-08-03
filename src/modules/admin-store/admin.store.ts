import React from 'react';
import { observable, action, makeObservable } from 'mobx';
import adminService from './admin.service';
import { NewAccountDto } from '../account/account.dto';
import { newAdminFormInit } from './admin.constants';

class StoreStore {
    @observable accounts: any[] = [];
    @observable totalCount: number = 0;
    @observable adminForm: any = newAdminFormInit;
    @observable currentStore: any;
    @observable chosenAddress: string = '';
  
    @action.bound
    async getAccounts(skip: number, take: number) {
        let data: any = [];
        data = await adminService.getAccounts(skip, take);
        this.accounts = data[0];
        this.totalCount = data[1];
    }

    @action.bound
    async getAccountById(id: number) {
        const result = await adminService.getAccountById(id);
        if (result) {
            this.setAdminForm(result);
            this.currentStore = result;
        }
        return result;
    }

    @action.bound
    async setAdminForm(data: any) {
        this.adminForm = data;
    }

    @action.bound
    async resetAdminForm() {
        this.adminForm = newAdminFormInit;
    }

    @action.bound
    async addAccount() {
        const data = await adminService.addAccount(this.adminForm);
        return data;
    }

    @action.bound
    async updateAccount(id: number, model: any) {
        const result = await adminService.updateAccount(id, model);
        return result.data;
    }

    @action.bound
    async deleteAccount(id: number) {
        const result = await adminService.deleteAccount(id);
        return result.data?.result;
    }

    @action.bound
    async setAddressStr(addr: string) {
        this.chosenAddress = addr;
    }

    @action.bound
    async setAddress(id: number, addr: string, Lat: number, Lng: number) {
        const result = await adminService.setAddress(id, addr, Lat, Lng);
        return result.data;
    }

    constructor() {
        makeObservable(this);
    }
  }
  
  export default new StoreStore();
  
  export const StoreStoreContext = React.createContext(new StoreStore());
  