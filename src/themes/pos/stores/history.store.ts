import React from 'react';
import { observable, action, makeObservable, autorun } from 'mobx';
import orderService from '../services/order.service';
import cartService from '../services/cart.service';

class HistoryStore {
    @observable cashiers: any = undefined;
    @observable currentCashierId: number = 1;
    @observable sessions: any[] = [];
    @observable orders: any[] = [];
    @observable pastStores: any[] = [];
    @observable currentDetailSession: any;
    @observable totalCount: number = 0;
    @observable pageNum: number = 1;
    @observable pageSize: number = 10;
    @observable searchKey: string = '';
    @observable loading: boolean = true;

    @action.bound
    async getAllCashiers() {
        this.loading = true;
        const result = await cartService.getAllCashiers();
        console.log("-------------------");
        console.log(result);
        this.cashiers = result;
        this.loading = false;
    }

    @action.bound
    async setCurrentCashier(id: number) {
        this.loading = true;
        this.currentCashierId = id;
        this.loading = false;
    }

    @action.bound
    async getPastSessions(id: number) {
        this.loading = true;
        let data: any = [];
        let ordersdata: any = [];
        this.pageNum = 1;
        this.pageSize = 10;
        this.totalCount = 0;
        if (id) {
            await this.setCurrentCashier(id);
            data = await cartService.getPastSessions(this.pageNum, this.pageSize, id);
            ordersdata = await orderService.getPastOrders(this.pageNum, this.pageSize, id);
        }
        else {
            await this.setCurrentCashier(id);
            data = await cartService.getPastSessions(this.pageNum, this.pageSize, this.currentCashierId);
            ordersdata = await orderService.getPastOrders(this.pageNum, this.pageSize, this.currentCashierId);
        }
        this.orders = ordersdata.items;
        this.sessions = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async getPastStores(id: number) {
        this.loading = true;
        let datas: any = [];
        if (id) {
            await this.setCurrentCashier(id);
            datas = await cartService.getPastStores(id);
        }
        else {
            await this.setCurrentCashier(id);
            datas = await cartService.getPastStores(this.currentCashierId);
        }
        for (let data of datas) {
            this.pastStores.push({ 'StoreId': String(data.StoreId), 'FinalTotal': Number(data.FinalTotal)});
        }
        // this.pastStores = data;
        console.log("-------------------------");
        console.log(datas);
        this.loading = false;
    }

    @action.bound
    async getCurrentSessionDetail(id: string) {
        this.loading = true;
        this.pageNum = 1;
        this.pageSize = 10;
        this.totalCount = 0;
        const data = await cartService.getSessionDetail(id);
        const ordersdata = await orderService.getPastSessions(this.pageNum, this.pageSize, id);
        console.log(data);
        this.currentDetailSession = data;
        this.orders = ordersdata.items;
        this.totalCount = ordersdata.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async deleteCurrentSessionDetail(id: string) {
        this.loading = true;
        this.currentDetailSession = undefined;
        this.orders = [];
        this.loading = false;
    }

    @action.bound
    async changePage(page: number, pageSize: number) {
        this.loading = true;
        let data: any = [];
        this.pageNum = page;
        this.pageSize = pageSize
        data = await cartService.getPastSessions(page, pageSize, this.currentCashierId);
        this.sessions = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }


    constructor() {
        makeObservable(this);
        autorun(() => console.log(this.sessions));
    }

}

export default new HistoryStore();

export const HistoryStoreContext = React.createContext(new HistoryStore());
