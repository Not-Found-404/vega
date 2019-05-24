import {ShopCommonService} from "./shop.common.service";

/**
 * 店铺web服务
 */
export class ShopWebService extends ShopCommonService {


    /**
     * 店铺详情
     * @param request
     */
    shopGetDetail = (request) => {
        this.post({
            url: '/api/web/shop/get/detail',
            request: request
        });
    }
}
