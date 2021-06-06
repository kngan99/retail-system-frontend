import http from "../../../common/sevices";
import { message } from 'antd';
import { OrderListDto } from "./list.dto";
import { prepareGetQuery } from "../../../common/utils/routes.util";

class VNPService {
    vnpPrefix: string = "http://localhost:8888/order";

    public async createUrl(amount: number) {
        const result = await http.post(`${this.vnpPrefix}/create_payment_url/${amount}`, {
        });
        console.log(result);
        return result;
    }

}

export default new VNPService();
