import http from "../../../common/sevices";
import { message } from 'antd';
import moment from "moment";

interface CashierInfo {
    Salesclerk: any;
    Session: any;
}

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
    Discount: number
    Total: number;
    NewDiscount: number
}

class PromotionService {
    orderdiscountPrefix: string = "https://warehouse-retail.herokuapp.com/api/orderdiscounts";
    productdiscountPrefix: string = "https://warehouse-retail.herokuapp.com/api/productdiscounts";
    productPrefix: string = "https://warehouse-retail.herokuapp.com/api/products";


    // public async confirmOrder(SalescleckId: number, SessionId: string, cartproducts: CartProduct[], CustomerId: number, Discount: number) {
    //     const result = await http.post(`${this.orderPrefix}`, {
    //         order: {
    //             orderDate: moment().format("DD-MM-YYYY hh:mm:ss"),
    //             saleClerkId: SalescleckId,
    //             sessionId: SessionId,
    //             customerId: CustomerId,
    //             discount: Discount
    //         },
    //         cartproducts: cartproducts
    //     });
    //     return result.data;
    // }

    public async getPromotion(skip: number, take: number) {
        const result = await http.get(`${this.orderdiscountPrefix}`, {
            params: {
                page: skip,
                limit: take,
            },
        });
        return result.data;
    }

    public async createPromotion(promotion: any) {
        console.log("Value before sending")
        console.log(promotion);
        const result = await http.post(`${this.orderdiscountPrefix}/`, {
            ...promotion,
        });
        return result.data;
    }

    public async updatePromotion(id: number, promotion: any) {
        console.log("Value before sending")
        console.log(promotion);
        const result = await http.put(`${this.orderdiscountPrefix}/${id}`, {
            ...promotion,
        });
        return result.data;
    }

    public async getProdSelect() {
        const result = await http.get(`${this.productPrefix}`);
        return result.data;
    }

    public async getProdPromotion(skip: number, take: number) {
        const result = await http.get(`${this.productdiscountPrefix}`, {
            params: {
                page: skip,
                limit: take,
            },
        });
        return result.data;
    }

    public async createProdPromotion(promotion: any) {
        console.log("Value before sending")
        console.log(promotion);
        const result = await http.post(`${this.productdiscountPrefix}/`, {
            ...promotion,
        });
        return result.data;
    }

    public async updateProdPromotion(id: number, promotion: any) {
        console.log("Value before sending")
        console.log(promotion);
        const result = await http.put(`${this.productdiscountPrefix}/${id}`, {
            ...promotion,
        });
        return result.data;
    }

}

export default new PromotionService();
