import {CategoryCommonService} from "./category.common.service";

export class CategoryAdminService extends CategoryCommonService {
    /**
     * 創建店铺类目
     * @param request 参数
     */
    create = (request) => {
        console.log('创建店铺类目');
        this.put({
            url: '/api/admin/shop/category/create',
            request: request
        });
    };

    /**
     * 修改店铺类目
     * @param request
     */
    update = (request) => {
        console.log('修改店铺类目');
        this.post({
            url: '/api/admin/shop/category/update',
            request: request
        });
    };

  /**
   * 得到当前店铺的类目信息
   * @param request
   */
  adminList = (request) => {
    console.log('查询店铺类目');
    this.get({
      url: '/api/admin/shop/category/category/list',
      request: request
    });
  };
}
