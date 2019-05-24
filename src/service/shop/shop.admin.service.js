import {ShopCommonService} from "./shop.common.service";

/**
 * 店铺管理服务
 */
export class ShopAdminService extends ShopCommonService {
    /**
     * 创建店铺
     */
    shopCreate = (request) => {
        this.put({
            url: '/api/admin/shop/create',
            request: request
        })
    };

    /**
     * 更新店铺
     */
    shopUpdate = (request) => {
        this.post({
            url: '/api/admin/shop/update',
            request: request
        })
    };
}
