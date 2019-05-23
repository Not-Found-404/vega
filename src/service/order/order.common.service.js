import {AbstractService} from "../abstract.service";

export class OrderCommonService extends AbstractService {
    /**
     * 查看订单详情
     * @param request 参数
     */
    getDetail = (request) => {
        console.log('查看订单详情');
        this.get({
            url: '/api/common/order/get/detail',
            request: request
        });
    };
}
