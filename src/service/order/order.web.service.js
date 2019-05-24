import {OrderCommonService} from "./order.common.service";

export class OrderWebService extends OrderCommonService {
    /**
     * 创建订单
     * @param request
     */
    create = (request) => {
        console.log('创建订单');
        this.get({
            url: '/api/web/order/create',
            request: request
        });
    };
}