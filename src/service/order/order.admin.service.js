import {OrderCommonService} from "./order.common.service";

export class OrderAdminService extends OrderCommonService {
    orderUpdate = (request) => {
        console.log('商家订单级更新');
        this.post({
            url: '/api/admin/order/update',
            request: request
        });
    };

  paymentPaging = (request) => {
    console.log('支付单分页');
    this.get({
      url: '/api/admin/order/payment/paging',
      request: request
    });
  };

    /**
     * 订单分页
     * @param request 参数
     */
    paging = (request) => {
        console.log('订单分页');
        this.get({
            url: '/api/admin/order/paging',
            request: request
        });
    };
}
