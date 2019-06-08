import { AbstractService } from '../abstract.service';
export class CartWebService extends AbstractService {
/**
 * 添加商品到购物车
 * @param request
 */
  updateCart = (request) => {
    this.post(
      {
        url: '/api/web/shopping/cart/create/or/update',
        request: request,
      }
    );
  };

  /**
   * 获取购物车信息
   */
  getCart = (request) => {
    this.get(
      {
        url: '/api/web/shopping/cart/get',
        request: request,
      }
    );
  }
}
