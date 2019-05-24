import {ItemCommonService} from "./item.common.service";
import {AbstractRequest} from "../abstract.request";

export class ItemAdminService extends ItemCommonService {
    /**
     * 调整库存
     * @param request 参数
     */
    inventoryAdjust = (request) => {
        console.log('调整库存');
        this.post({
            url: '/api/admin/item/adjust',
            request: request
        });
    };

    /**
     * 创建商品
     * @param request 参数
     */
    createItem = (request) => {
        console.log('创建商品');
        this.put({
            url: '/api/admin/item/create',
            request: request
        });
    };

    /**
     * 商品分页
     * @param request 参数
     */
    paging = (request) => {
        console.log('商品分页');
        this.get({
            url: '/api/admin/item/paging',
            request: request
        });
    };

    /**
     * 修改商品信息
     * @param request
     */
    update = (request) => {
        console.log('修改商品信息');
        this.post({
            url: '/api/admin/item/update',
            request: request
        });
    };
}