import { AbstractService } from '../abstract.service';
export class CartWebService extends AbstractService {
/**
 * 添加商品到购物车
 * @param request
 */
  createCartGoods = (request) => {
    this.post(
      {
        url: '/api/web/shopping/cart/create',
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

  /**
   * 根据购物车行编号删除购物车行
   */
  deleteCartGoodsByCartId = (request) => {
    this.post(
      {
        url: '/api/web/shopping/cart/remove',
        request: request,
      }
    );
  }

  /**
   * 按店铺编号清空购物车
   */
  clearCartByShopId = (request) => {
    this.post(
      {
        url: '/api/web/shopping/cart/shop/remove/all',
        request: request,
      }
    );
  }

  /**
   * 修改购物车行商品数量
   */
  updateCartGoodsQuantity = (request) => {
    this.post(
      {
        url: '/api/web/shopping/cart/update',
        request: request,
      }
    );
  }

}
