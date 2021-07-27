import React from 'react';
import { observable, action, makeObservable, autorun } from 'mobx';
import orderService from '../services/order.service';
import cartService from '../services/cart.service';

class OrderStore {
    @observable orders: any[] = [];
    @observable currentDetailOrder: any;
    @observable order: any;
    @observable products: any[] = [];
    @observable totalCount: number = 0;
    @observable pageNum: number = 1;
    @observable pageSize: number = 10;
    @observable searchKey: string = '';
    @observable loading: boolean = true;

    @action.bound
    async getPastOrders() {
        this.loading = true;
        let data: any = [];
        this.pageNum = 1;
        this.pageSize = 10;
        this.totalCount = 0;
        data = await orderService.getPastOrders(this.pageNum, this.pageSize);
        this.orders = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async changePage(page: number, pageSize: number) {
        this.loading = true;
        let data: any = [];
        this.pageNum = page;
        this.pageSize = pageSize
        data = await orderService.getPastOrders(this.pageNum, this.pageSize);
        this.orders = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async getCurrentOrderDetail(id: number) {
        this.loading = true;
        const data = await orderService.getOrderDetail(id);
        this.currentDetailOrder = data;
        this.order = this.currentDetailOrder.existedOrder;
        this.products = this.currentDetailOrder.existedProductOrder[0];
        console.log(this.products);
        this.loading = false;
    }


    constructor() {
        makeObservable(this);
        autorun(() => console.log(this.orders));
    }

}

export default new OrderStore();

export const OrderStoreContext = React.createContext(new OrderStore());
