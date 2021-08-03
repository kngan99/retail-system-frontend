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
}

class OrderService {
    orderPrefix: string = "http://warehouse-retail.herokuapp.com/api/orders";

    public async confirmOrder(SalescleckId: number, SessionId: string, cartproducts: CartProduct[], CustomerId: number, Discount: number) {
        const result = await http.post(`${this.orderPrefix}`, {
            order: {
                orderDate: moment().format("DD-MM-YYYY hh:mm:ss"),
                saleClerkId: SalescleckId,
                sessionId: SessionId,
                customerId: CustomerId,
                discount: Discount
            },
            cartproducts: cartproducts
        });
        return result.data;
    }

    public async confirmStripeOrder(SalescleckId: number, SessionId: string, cartproducts: CartProduct[], CustomerId: number, Discount: number, Stripe: string) {
        const result = await http.post(`${this.orderPrefix}`, {
            order: {
                orderDate: moment().format("DD-MM-YYYY hh:mm:ss"),
                saleClerkId: SalescleckId,
                sessionId: SessionId,
                customerId: CustomerId,
                discount: Discount,
                stripe: Stripe,
            },
            cartproducts: cartproducts
        });
        return result.data;
    }

    public async confirmVnpayOrder(SalescleckId: number, SessionId: string, cartproducts: CartProduct[], CustomerId: number, Discount: number, Vnpay: string) {
        const result = await http.post(`${this.orderPrefix}`, {
            order: {
                orderDate: moment().format("DD-MM-YYYY hh:mm:ss"),
                saleClerkId: SalescleckId,
                sessionId: SessionId,
                customerId: CustomerId,
                discount: Discount,
                vnpay: Vnpay,
            },
            cartproducts: cartproducts
        });
        return result.data;
    }

    public async getPastSessions(skip: number, take: number, key: string) {
        const result = await http.get(`${this.orderPrefix}/paginateOrdersBySession`, {
            params: {
                page: skip,
                limit: take,
                key: key,
            },
        });
        return result.data;
    }

    public async getPastOrders(skip: number, take: number) {
        const result = await http.get(`${this.orderPrefix}/paginateOrders`, {
            params: {
                page: skip,
                limit: take,
            },
        });
        return result.data;
    }

    public async getOrderDetail(id: number) {
        const result = await http.get(`${this.orderPrefix}/id/${id}`, {
        });
        return result.data;
    }

    public async getPromotion(id: number, total: number) {
        const result = await http.get(`${this.orderPrefix}/promotion/${id}`, {
            params: {
                total: total,
            },
        });
        return result.data;
    }

    public async getTransactions(productIds: number[]) {
        const result = await http.get(`${this.orderPrefix}/apriori-orders`, {
            params: {
                productIds: productIds,
            },
        });
        return result.data;
    }

}

export default new OrderService();
