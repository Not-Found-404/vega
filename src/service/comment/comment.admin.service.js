import {CommentCommonService} from "./comment.common.service";

export class CommentAdminService extends CommentCommonService {
  /**
   * 隐藏/显示 评价
   * @param request
   */
  enable = (request) => {
    console.log('显示/隐藏评价');
    this.post({
      url: '/api/admin/comment/enable',
      request: request
    });
  };

  /**
   * 显示的当前商家的评价
   * @param request
   */
  adminPaging = (request) => {
    console.log('当前商家评价');
    this.get({
      url: '/api/admin/comment/paging',
      request: request
    });
  };
}
