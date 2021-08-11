import React from 'react';
import { observable, action, makeObservable, autorun } from 'mobx';
import orderService from '../services/promotion.service';
import { toast } from 'react-toastify';

class ProdPromotionStore {
    @observable products: any[] = [];
    @observable promotions: any[] = [];
    @observable totalCount: number = 0;
    @observable pageNum: number = 1;
    @observable pageSize: number = 10;
    @observable loading: boolean = true;

    @action.bound
    async getPromotions() {
        this.loading = true;
        this.products = await orderService.getProdSelect();
        let data: any = [];
        data = await orderService.getProdPromotion(this.pageNum, this.pageSize);
        this.promotions = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async changePage(page: number, pageSize: number) {
        this.loading = true;
        this.products = await orderService.getProdSelect();
        let data: any = [];
        this.pageNum = page;
        this.pageSize = pageSize
        data = await orderService.getProdPromotion(this.pageNum, this.pageSize);
        this.promotions = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async createPromotion(promotion: any) {
        this.loading = true;
        this.products = await orderService.getProdSelect();
        const valid = await orderService.createProdPromotion(promotion);
        if (valid) {
            toast("Created Successfully!");
        }
        else {
            toast("Error on creating new promotion!")
        }
        await this.getPromotions();
        this.loading = false;
    }

    @action.bound
    async updatePromotion(id: number, promotion: any) {
        this.loading = true;
        this.products = await orderService.getProdSelect();
        const valid = await orderService.updateProdPromotion(id, promotion);
        if (valid) {
            toast("Updated Successfully!");
        }
        else {
            toast("Error on updating promotion!")
        }
        await this.getPromotions();
        this.loading = false;
    }

    constructor() {
        makeObservable(this);
        autorun(() => console.log(this.promotions));
    }

}

export default new ProdPromotionStore();

export const ProdPromotionStoreContext = React.createContext(new ProdPromotionStore());
