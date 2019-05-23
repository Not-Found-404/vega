import {TagCommonService} from "./tag.common.service";

export class TagAdminService extends TagCommonService {
    /**
     * 创建店铺标签
     * @param request 参数
     */
    create = (request) => {
        console.log('创建店铺标签');
        this.put({
            url: '/api/admin/tag/create',
            request: request
        });
    };

    /**
     * 更新店铺标签
     * @param request 参数
     */
    update = (request) => {
        console.log('更新店铺标签');
        this.post({
            url: '/api/admin/tag/update',
            request: request
        });
    };

    /**
     * 删除店铺标签
     * @param request 请求参数
     */
    delete = (request) => {
        console.log('删除店铺标签');
        this.post({
            url: '/api/admin/tag/delete',
            request: request
        });
    }
}
