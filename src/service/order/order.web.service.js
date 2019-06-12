import {OrderCommonService} from "./order.common.service";

export class OrderWebService extends OrderCommonService {
    /**
     * 创建订单
     * @param request
     */
    create = (request) => {
        console.log('创建订单');
        this.post({
            url: '/api/web/order/create',
            request: request
        });
    };

    webOrderList = (request) =>{
      console.log('用戶订单');
      this.get({
        url: '/api/web/order/list',
        request: request
      });
    };

  payOrder = (request) =>{
    console.log('支付订单');
    this.post({
      url: '/api/web/order/pay',
      request: request
    });
  };

  cancel = (request) =>{
    console.log('取消订单');
    this.post({
      url: '/api/web/order/cancel',
      request: request
    });
  };
}
