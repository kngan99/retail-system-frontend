import React from 'react';
import { observable, action, makeObservable, autorun } from 'mobx';
import orderService from '../services/promotion.service';

class PromotionStore {
    @observable promotions: any[] = [];
    @observable totalCount: number = 0;
    @observable pageNum: number = 1;
    @observable pageSize: number = 10;
    @observable loading: boolean = true;

    @action.bound
    async getPromotions() {
        this.loading = true;
        let data: any = [];
        data = await orderService.getPromotion(this.pageNum, this.pageSize);
        this.promotions = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async changePage(page: number, pageSize: number) {
        this.loading = true;
        let data: any = [];
        this.pageNum = page;
        this.pageSize = pageSize
        data = await orderService.getPromotion(this.pageNum, this.pageSize);
        this.promotions = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async createPromotion(promotion: any) {
        this.loading = true;
        await orderService.createPromotion(promotion);
        await this.getPromotions();
        this.loading = false;
    }

    @action.bound
    async updatePromotion(id: number, promotion: any) {
        this.loading = true;
        await orderService.updatePromotion(id, promotion);
        await this.getPromotions();
        this.loading = false;
    }

    constructor() {
        makeObservable(this);
        autorun(() => console.log(this.promotions));
    }

}

export default new PromotionStore();

export const PromotionStoreContext = React.createContext(new PromotionStore());