import React from 'react';
import { observable, action, makeObservable, autorun } from 'mobx';
import orderService from '../services/order.service';
import cartService from '../services/cart.service';

class HistoryStore {
    @observable sessions: any[] = [];
    @observable orders: any[] = [];
    @observable currentDetailSession: any;
    @observable totalCount: number = 0;
    @observable pageNum: number = 1;
    @observable pageSize: number = 10;
    @observable searchKey: string = '';
    @observable loading: boolean = true;

    @action.bound
    async getPastSessions() {
        this.loading = true;
        let data: any = [];
        let ordersdata: any = [];
        this.pageNum = 1;
        this.pageSize = 10;
        this.totalCount = 0;
        data = await cartService.getPastSessions(this.pageNum, this.pageSize);
        ordersdata = await orderService.getPastOrders(this.pageNum, this.pageSize);
        this.orders = ordersdata.items;
        this.sessions = data.items;
        this.totalCount = data.meta.totalItems;
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
        data = await cartService.getPastSessions(page, pageSize);
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
