import React from 'react';
import { observable, action, makeObservable, autorun } from 'mobx';
import productService from './product.service';
import { Product } from './product.dto';

class ProductStore {
    @observable products: Product[] = [];
    @observable categories: any[] = [];
    @observable totalCount: number = 0;
    @observable pageNum: number = 1;
    @observable pageSize: number = 10;
    @observable refetch: boolean = true;
    @observable searchKey: string = '';
    @observable loading: boolean = true;

    @action.bound
    async getProducts(skip: number, take: number) {
        this.loading = true;
        let data: any = [];
        data = await productService.searchProductsPagination(skip, take, this.searchKey);
        this.products = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async createProducts(product: Product) {
        this.loading = true;
        await productService.createProduct(product);
        let data: any = [];
        data = await productService.searchProductsPagination(this.pageNum, this.pageSize, this.searchKey);
        this.products = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async updateProducts(id: number, product: Product) {
        this.loading = true;
        await productService.updateProduct(id, product);
        let data: any = [];
        data = await productService.searchProductsPagination(this.pageNum, this.pageSize, this.searchKey);
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
        data = await productService.searchProductsPagination(page, this.pageSize, this.searchKey);
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
        data = await productService.searchProductsPagination(1, 10, key);
        this.products = data.items;
        this.totalCount = data.meta.totalItems;
        this.loading = false;
    }

    @action.bound
    async deleteProduct(Id: number) {
        this.loading = true;
        let data: any = [];
        await productService.deleteProducts(Id);
        data = await productService.searchProductsPagination(this.pageNum, this.pageSize, this.searchKey);
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
        data = await productService.searchProductsPagination(this.pageNum, this.pageSize, this.searchKey.trim());
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

export default new ProductStore();

export const ProductStoreContext = React.createContext(new ProductStore());
