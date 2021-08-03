import React from 'react';
import { observable, action, makeObservable, autorun } from 'mobx';
import productService from './product.service';
import { Product } from './product.dto';
import ProductSummary from '../warehouse/components/ProductSummary/index';

class ProductStore {
    @observable products: Product[] = [];
    @observable categories: any[] = [];
    @observable salesForecast: any[] = [];
    @observable totalCount: number = 0;
    @observable pageNum: number = 1;
    @observable pageSize: number = 10;
    @observable refetch: boolean = true;
    @observable searchKey: string = '';
    @observable loading: boolean = true;
    @observable summaryProducts: any[] = [];
    @observable noSummaryProducts: number = -1;
    @observable totalIncome: number = 0;
    @observable productsLabel: any[] = [];
    @observable quantity: number[] =  [];
    @observable income: number[] = [];

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
    async getProductForecast(id: number) {
        this.loading = true;
        const data = await productService.getProductForecast(id);
        console.log(data.data);
        const result = data.data;
        var temp = [] as any;
        result.map(item => {
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(item[0]);
            console.log(d);
            temp.push({ year: new Date(parseInt(item[0])).getDate() + '/' + (new Date(parseInt(item[0])).getMonth() + 1), value: item[1] });
            console.log(item);
        });
        this.salesForecast = temp;
        console.log(this.salesForecast);
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

    @action.bound
    async addBarcode(id: number, code: string) {
        await productService.addBarcode(id, code);
    }
    @action.bound
    async getPeriodSummary(start: Date, end: Date) {
        const res = await productService.getPeriodSummary(start, end);
        this.totalIncome = res.sum[0].FinalTotal;
        let i = 0;
        this.summaryProducts = this.productsLabel = this.income = this.quantity = [];
        while (res.items[i]) {
            this.summaryProducts.push(res.items[i]);
            this.productsLabel.push(res.items[i].ProductName);
            this.income.push(res.items[i].Price/1000);
            this.quantity.push(res.items[i].Quantity);
            i++;
        }
        this.noSummaryProducts = i;
    }


    constructor() {
        makeObservable(this);
        autorun(() => console.log(this.products));
    }

}

export default new ProductStore();

export const ProductStoreContext = React.createContext(new ProductStore());
