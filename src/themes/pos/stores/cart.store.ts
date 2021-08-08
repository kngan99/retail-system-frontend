import React from 'react';
import { observable, action, computed, reaction, makeObservable, autorun, transaction } from 'mobx';
import productService from '../../../modules/product/product.service';
import cartService from '../services/cart.service'
import orderService from '../services/order.service'
import customerService from '../services/customer.service'
import { message } from 'antd';
// import { Product } from '../../../modules/product/product.dto';
import { removeUnusedProps } from '../../../common/utils/apis.util';
import { OrderListDto } from '../services/list.dto';
import { retrieveFromStorage } from '../../../common/utils/storage.util';
import { toast } from 'react-toastify';

interface CartProduct {
    Id: number;
    ProductName: string;
    CategoryId: number;
    QuantityPerUnit: string;
    UnitPrice: number;
    UnitsInStock: number;
    ReorderLevel: number;
    Discontinued: boolean;
    Quantity: number;
    Discount: number;
    Total: number;
    RawTotal: number;
    NewDiscount: number;
}
interface Product {
    Id: number;
    ProductName: string;
    CategoryId: number;
    QuantityPerUnit: string;
    UnitPrice: number;
    UnitsInStock: number;
    ReorderLevel: number;
    Discontinued: boolean;
    Discount: number;
    NewDiscount: number;
}

interface Session {
    SessionId: string;
    Start: string;
    End: string;
    Type: string;
    SalecleckId: number;
}

interface CargoRequest {
    ProductId : number[];
    Quantity: number[];
    warehouseId: number;
    StoreId: number;
    Status?: string | null;
    Notes?: string | null;
}

class CartStore {
    @observable productsInCart: CartProduct[] = [];
    @observable productsApriori: Product[] = [];
    @observable productsAprioriId: number[] = [];
    @observable productsAprioriName: string[] = [];
    @observable productsAprioriIdStr: string = '';
    @observable productsAprioriNameStr: string = '';
    @observable transactions: any[] = [];
    @observable noTransactions: number = 0;
    @observable transactionStr: string = '';
    @observable transactionArray: any[] = [];
    @observable transactionArrayName: any[] = [];
    @observable transactionStrName: string = '';
    @observable transactionStrOneOrderProductsName: string[] = [];
    @observable j: number = 0;
    @observable coupon: number = 0;
    @observable discount: number = 0;
    @observable loading: boolean = true;
    @observable loading2: boolean = false;
    @observable customers: any[] = [];
    @observable currentCustomer: any = { Id: 0, Phone: "", Address: "", City: "", Country: "", ContactName:"" };
    @observable session: string = '';
    @observable sessionStart: string = '';
    @observable salescleckId: number = 0;
    @observable salescleckFullName: string = '';
    @observable salescleckStore: any = undefined;
    @observable isCheckout: boolean = false;
    @observable isConfirm: boolean = false;
    @observable orderId: number = 0;
    @observable orderStatus: string = '';
    @observable cargoRequest: CargoRequest = {
        ProductId: [],
        Quantity: [],
        warehouseId: -1,
        StoreId: -1,
    };
    @observable firstApriori: boolean = true;

    @computed get totalNum() {
        let total = 0;
        for (let item of this.productsInCart) {
            total = total + (item.Quantity)
        }
        return Number(total.toFixed(2));;
    }
    @computed get subtotalAmount() {
        let total = 0;
        for (let item of this.productsInCart) {
            total = total + (item.Total)
        }
        return Number(total.toFixed(2));
    }
    @computed get totalAmount() {
        let total = 0;
        for (let item of this.productsInCart) {
            total = total + (item.Total)
        }
        return Number(total.toFixed(2)) - this.discount;
    }
    @observable orders: any[] = [];
    @observable totalCount: number = 0;
    @observable selectedOrder: any = null;
    @observable editingAdminOrder: any = null;


    @action.bound
    addApriori = async (product: Product) => {
        let found = false;
        await this.productsApriori.map(item => {
            if (item.Discontinued) {
                toast("Selected item is out of stock now!");
            }
            if (item.Id === product.Id) {
                toast("This product has been added");
                found = true;
            }
        });
        console.log(product.Id + '' + found);
        if (!found) {
            await this.productsApriori.push({ ...product });
            if (this.firstApriori) {
                this.productsAprioriIdStr += product.Id;
                this.productsAprioriNameStr += product.ProductName;
                this.firstApriori = false;
            }
            else {
                this.productsAprioriIdStr += ', ' + product.Id;
                this.productsAprioriNameStr += ', ' + product.ProductName;
            }
            this.productsAprioriId.push(product.Id);
            this.productsAprioriName.push(product.ProductName);
            toast("Added product " + product.ProductName);
        } 
    }

    @action.bound
    removeApriori = async (product: Product) => {
        const index = this.productsApriori.findIndex(({ Id }) => Id === product.Id);
        if (index >= 0) {
            this.productsApriori.splice(index, 1);
            this.productsAprioriId.splice(index, 1);
            this.productsAprioriIdStr = this.productsAprioriId.join(', ');
            this.productsAprioriName.splice(index, 1);
            this.productsAprioriNameStr = this.productsAprioriName.join(', ');
        }
    }

    @action.bound
    emptyApriori = async () => {
        this.productsApriori.splice(0, this.productsInCart.length);
    }

    @action.bound
    getTransactions = async () => {
        this.loading2 = true;
        const res = await orderService.getTransactions(this.productsAprioriId);
        this.transactions = res[0];
        for (let i = 0; i < res[1]; i++){
            this.transactionArray.push(res[0][i].ProductIds.join(', '));
            for (this.j = 0; this.j < res[0][i].Products[1]; this.j++) {
                this.transactionStrOneOrderProductsName.push(res[0][i].Products[0][this.j].Product.ProductName);
            }
            this.transactionArrayName.push(this.transactionStrOneOrderProductsName.join(', '));
            this.j = 0;
            this.transactionStrOneOrderProductsName = [];
        }
        this.transactionStr = this.transactionArray.join('\n');
        this.transactionStrName = this.transactionArrayName.join('\n');
        this.noTransactions = res[1];
        this.loading2 = false;
    }

    @action.bound
    resetCurrentCustomer = async () => {
        this.currentCustomer = { Id: 0, Phone: "", Address: "", City: "", Country: "", ContactName:"" };
        this.customers = [];
    }

    @action.bound
    addToCart = async (product: Product) => {
        if (product.Discontinued) {
            toast("Selected item is out of stock now!");
        }
        else {
            let found = false;
            await this.productsInCart.map(item => {
                if (item.Id === product.Id) {
                    item.Quantity += 1;
                    item.RawTotal = Number((item.UnitPrice * item.Quantity).toFixed(2));
                    item.Total = Number((item.UnitPrice * item.Quantity * (100 - item.NewDiscount) / 100).toFixed(2));
                    found = true;
                    const index = this.productsInCart.findIndex(({ Id }) => Id === product.Id);
                    this.productsInCart.splice(index, 1, item);
                }
            });
            if (!found) {
                await this.productsInCart.push({ ...product, Quantity: 1, RawTotal: product.UnitPrice, Total: Number((product.UnitPrice * (100 - product.NewDiscount) / 100).toFixed(2)) });
            }
        }
    }
    @action.bound
    addToCartById = async (id: number) => {
        const promise = productService.getOne(id);
        promise.then((res: any) => {
            if (res.data != "") {
                this.addToCart(res.data);
            }
            else {
                toast("Invalid ID!");
            }
        });
        promise.catch((err: any) => {
            toast(err.response);
        });
    }

    @action.bound
    addToCartByBarcode = async (barcode: string) => {
        const id = await productService.getProductIdByBarcode(barcode);
        const promise = productService.getOne(id);
        promise.then((res: any) => {
            if (res.data != "") {
                this.addToCart(res.data);
            }
            else {
                toast("Invalid ID!");
            }
        });
        promise.catch((err: any) => {
            toast(err.response);
        });
    }

    @action.bound
    updateQuantity = async (product: Product, quantity: number) => {
        await this.productsInCart.map(item => {
            if (item.Id === product.Id) {
                item.Quantity = Number(quantity);
                item.RawTotal = Number((item.UnitPrice * item.Quantity).toFixed(2));
                item.Total = Number((item.UnitPrice * item.Quantity * (100 - item.NewDiscount) / 100).toFixed(2));
                const index = this.productsInCart.findIndex(({ Id }) => Id === product.Id);
                this.productsInCart.splice(index, 1, item);
            }
        });
    }
    @action.bound
    decreaseToCart = async (product: Product) => {
        await this.productsInCart.map(item => {
            if (item.Id === product.Id) {
                if (item.Quantity > 1) {
                    item.Quantity -= 1;
                    item.RawTotal = Number((item.UnitPrice * item.Quantity).toFixed(2));
                    item.Total = Number((item.UnitPrice * item.Quantity * (100 - item.NewDiscount) / 100).toFixed(2));
                    const index = this.productsInCart.findIndex(({ Id }) => Id === product.Id);
                    this.productsInCart.splice(index, 1, item);
                }
                else {
                    this.removeFromCart(product);
                }
            }
        });
    }
    @action.bound
    removeFromCart = async (product: Product) => {
        const index = this.productsInCart.findIndex(({ Id }) => Id === product.Id);
        if (index >= 0) {
            this.productsInCart.splice(index, 1);
        }
    }
    @action.bound
    emptyCart = async () => {
        this.productsInCart.splice(0, this.productsInCart.length);
    }
    @action.bound
    checkoutCart = async () => {
        this.isCheckout = true;
    }
    @action.bound
    newOrder = async () => {
        this.loading = true;
        this.emptyCart();
        this.resetPromotion();
        this.resetCurrentCustomer();
        this.isConfirm = false;
        this.isCheckout = false;
        this.loading = false;
    }
    @action.bound
    returnToCart = async () => {
        this.isCheckout = false;
    }
    @action.bound
    getCashierInfo = async () => {
        this.loading = true;
        const result = await cartService.getCashierInfo();
        console.log(result);
        if (result && result.Salesclerk) {
            this.salescleckFullName = result.Salesclerk.FName + " " + result.Salesclerk.LName;
            this.salescleckId = result.Salesclerk.Id;
            if (result.Salesclerk.Store) {
                this.salescleckStore = result.Salesclerk.Store;
            }
        }
        if (result && result.Session) {
            this.session = result.Session.SessionId;
            this.sessionStart = result.Session.Start;
        }
        this.loading = false;
    }
    @action.bound
    getCustomers = async (key: string) => {
        this.loading = true;
        const result = await customerService.searchCustomers(key);
        this.customers = result;
        this.loading = false;
    }
    @action.bound
    getPromotion = async (coupon: number) => {
        this.loading = true;
        this.resetPromotion();
        const result = await orderService.getPromotion(coupon, this.totalAmount);
        if (result) {
            this.discount = result;
        }
        this.loading = false;
    }
    @action.bound
    resetPromotion = async () => {
        this.loading = true;
        this.coupon = 0;
        this.discount = 0;
        this.loading = false;
    }
    @action.bound
    changeCustomer = async (id: number) => {
        this.loading = true;
        const result = this.customers.filter(a => a.Id == id);
        console.log(result[0]);
        this.currentCustomer = result[0];
        this.loading = false;
    }
    @action.bound
    async createCustomer(customer: any) {
        this.loading = true;
        const result = await customerService.createCustomer(customer);
        this.currentCustomer = result;
        this.loading = false;
    }
    @action.bound
    endSession = async () => {
        this.loading = true;
        const result = await cartService.endSession(this.session);
        if (result) {
            this.session = "";
            this.sessionStart = "";
        }
        this.loading = false;
    }
    @action.bound
    startSession = async () => {
        this.loading = true;
        const result = await cartService.startNewSession();
        if (result) {
            this.getCashierInfo();
        }
        this.loading = false;
    }
    @action.bound
    confirmOrder = async () => {
        const result = await orderService.confirmOrder(this.salescleckId, this.session, this.productsInCart, this.currentCustomer.Id, this.discount);
        if (result) {
            toast("Create order successfully!");
            console.log(result);
            this.orderId = result.result.Id;
            this.isConfirm = true;
        }
    }
    @action.bound
    confirmStripeOrder = async (stripe: string) => {
        const result = await orderService.confirmStripeOrder(this.salescleckId, this.session, this.productsInCart, this.currentCustomer.Id, this.discount, stripe);
        if (result) {
            toast("Create order successfully!");
            this.orderId = result.result.Id;
            this.isConfirm = true;
        }
    }
    @action.bound
    confirmVnpayOrder = async (vnpay: string) => {
        const result = await orderService.confirmVnpayOrder(this.salescleckId, this.session, this.productsInCart, this.currentCustomer.Id, this.discount, vnpay);
        if (result) {
            toast("Create order successfully!");
            this.orderId = result.result.Id;
            this.isConfirm = true;
        }
    }
    @action.bound
    fetchCart = async () => {
        return this.productsInCart;
    }

    @action.bound
    setCargoRequest = (warehouseId: number, storeId: number, action: string, status?: string | null, notes?: string | null) => {
        let prodId : number[] = [];
        let quan : number[] = [];
        for (let product of this.productsInCart) {
            prodId.push(product.Id);
            quan.push(product.Quantity);
        }
        if (action === 'Create') {
            this.cargoRequest = {
                ProductId: prodId,
                Quantity: quan,
                warehouseId: warehouseId,
                StoreId: storeId,
            }
        }
        else {
            this.cargoRequest = {
                ProductId: prodId,
                Quantity: quan,
                warehouseId: warehouseId,
                StoreId: storeId,
                Status: status,
                Notes: notes,
            }
        }
    }

    @action.bound
    resetCargoRequest = () => {
        this.cargoRequest = {
            ProductId: [],
            Quantity: [],
            warehouseId: -1,
            StoreId: -1,
            Status: null,
            Notes: null,
        };
    }

    @action.bound
    sendCargoRequest = async () => {
        const addedUserCargoRequest = {...this.cargoRequest, UserId: retrieveFromStorage('loggedId')};
        console.log(addedUserCargoRequest);
        const result = await cartService.createCargoRequest(addedUserCargoRequest);
        return result;
    }

    @action.bound
    updateCargoRequest = async (id: number) => {
        console.log(this.cargoRequest);
        const result = await cartService.updateCargoRequest(id, this.cargoRequest);
        return result;
    }

    @action.bound
    setProductInCart = (productsInCart: CartProduct[]) => {
       this.productsInCart = productsInCart;
    }

    @action.bound
    setOrderStatus = (status: string) => {
       this.orderStatus = status;
    }

    @action.bound
    async adminDeleteOrder(id: number) {
        const data = await cartService.adminDeleteOrder(id);
        return data;
    }

    @action.bound
    async cancelCargoReq(id: number) {
        const data = await cartService.cancelCargoReq(id);
        return data;
    }

    @action.bound
    async updateStatusCargoReq(id: number, curStatus: string) {
        let nextStatus = curStatus;
        if (curStatus === "Created") {
            nextStatus = "Confirmed";
        }
        else if (curStatus === "Confirmed") {
            nextStatus = "Delivering";
        }
        else if (curStatus === "Delivering") {
            nextStatus = "Success";
        }
        const data = await cartService.updateStatusCargoReq(id, nextStatus);
        return data;
    }

    @action.bound
    async getCargoReqStatus(id: number) {
        const res = await cartService.getCargoReqStatus(id);
        return res.data;
    }

    @action.bound
    async getOrderListByAdmin(criteria: OrderListDto) {
        const result = await cartService.getOrderListByAdmin(criteria);
        if (result) {
        if (result.data[0])
            this.orders = result.data[0].map((item: any) =>
            removeUnusedProps(item)
            );
        this.totalCount = result.data[1];
        }
    }

    @action.bound
    async getOrderById(id: number) {
        const data = await cartService.getOrderByID(id);
        this.selectedOrder = data;
        return data;
    }

    @action.bound
    async resetUpdateAdminOrder() {
        this.editingAdminOrder = null;
    }

    @action.bound
    async getOrderByIdByAdmin(orderId: number) {
        const data: any = await cartService.getOrderByID(orderId);
        this.editingAdminOrder = data;
        return data;
    }

    @action.bound
    async setProductsInCartQuantity() {
        const result = await this.selectedOrder.quantities.map((item, idx) => { this.productsInCart[idx].Quantity = item })
        console.log(this.productsInCart);
        return result;
    }

    @action.bound
    async setProductsInCartTotal() {
        const result = await this.selectedOrder.quantities.map((item, idx) => { this.productsInCart[idx].Total = item * this.productsInCart[idx].UnitPrice })
        return result;
    }
    
    constructor() {
        makeObservable(this);
        //autorun(() => console.log(this.productsInCart));
    }
}
export default new CartStore();

export const CartStoreContext = React.createContext(new CartStore());
