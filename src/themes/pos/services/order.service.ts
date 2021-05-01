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
    Total: number;
}

class OrderService {
    orderPrefix: string = "http://localhost:4000/api/orders";

    public async confirmOrder(SalescleckId: number, SessionId: string, cartproducts: CartProduct[]) {
        const result = await http.post(`${this.orderPrefix}`, {
            order: {
                orderDate: moment().format("DD-MM-YYYY hh:mm:ss"),
                saleClerkId: SalescleckId,
                sessionId: SessionId
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

}

export default new OrderService();
