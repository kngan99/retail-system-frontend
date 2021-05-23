import React from 'react';
import { observable, action, makeObservable, autorun } from 'mobx';
import productService from './product.service';
import storeproductService from './storeproduct.service';
import { Product } from './product.dto';
import { message } from 'antd';

class AddProductStore {
    @observable products: Product[] = [];
    @observable categories: any[] = [];
    @observable totalCount: number = 0;
    @observable pageNum: number = 1;
    @observable pageSize: number = 10;
    @observable searchKey: string = '';
    @observable loading: boolean = true;

    @action.bound
    async getProducts(skip: number, take: number) {
        this.loading = true;
        let data: any = [];
        data = await productService.searchNotAddedProductsPagination(skip, take, this.searchKey);
        this.products = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async changePage(page: number, pageSize: number) {
        this.loading = true;
        let data: any = [];
        this.pageNum = page;
        this.pageSize = pageSize
        data = await productService.searchNotAddedProductsPagination(page, this.pageSize, this.searchKey);
        this.products = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async changeSearchKey(key: string) {
        this.loading = true;
        let data: any = [];
        this.pageNum = 1;
        this.pageSize = 10;
        this.searchKey = key.trim();
        data = await productService.searchNotAddedProductsPagination(1, 10, key);
        this.products = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async addProduct(Id: number) {
        this.loading = true;
        let data: any = [];
        const result = await storeproductService.addProduct(Id);
        if (result) {
            message.success("Add product to store successfully!");
        }
        data = await productService.searchNotAddedProductsPagination(this.pageNum, this.pageSize, this.searchKey);
        this.products = data.items;
        this.totalCount = data.meta.totalItems;
        this.pageNum = data.meta.currentPage;
        this.pageSize = data.meta.itemCount;
        this.loading = false;
    }

    @action.bound
    async startSearch() {
        this.loading = true;
        let data: any = [];
        data = await productService.searchNotAddedProductsPagination(this.pageNum, this.pageSize, this.searchKey.trim());
        this.categories = await productService.getAllCategories();
        console.log(this.categories);
        this.products = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    constructor() {
        makeObservable(this);
        autorun(() => console.log(this.products));
    }

}

export default new AddProductStore();

export const AddProductStoreContext = React.createContext(new AddProductStore());
