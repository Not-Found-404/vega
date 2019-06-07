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
}
