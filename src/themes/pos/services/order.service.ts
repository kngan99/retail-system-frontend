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

}

export default new OrderService();
