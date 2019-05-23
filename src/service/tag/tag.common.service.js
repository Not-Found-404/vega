import {AbstractService} from "../abstract.service";

export class TagCommonService extends AbstractService {

    /**
     * 获得店铺标签列表
     * @param request
     */
    list = (request) => {
        console.log('获得店铺标签列表');
        this.get({
            url: '/api/common/tag/list',
            request: request
        });
    };
}
