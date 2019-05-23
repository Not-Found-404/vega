import {AbstractService} from "../abstract.service";
import {AbstractRequest} from "../abstract.request";

export class ItemCommonService extends AbstractService {
    /**
     * 根据id得到商品信息
     * @param request 参数
     */
    getItemInfo = (request) => {
        console.log('查看商品');
        this.get({
            url: '/api/common/item/get',
            request: request
        });
    };
}

