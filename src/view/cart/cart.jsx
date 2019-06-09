import React from 'react';
import './cart.css';
import classnames from 'classnames'; // className 操作库
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Sticky, StickyContainer } from 'react-sticky';
import { Icon, ListView, Modal, NavBar, Checkbox, Toast } from 'antd-mobile';
import { CartWebService } from '../../service/cart/cart.web.service';

export class Cart extends React.Component {
  // 服务
  cartWebService = new CartWebService();
  constructor(props) {
    super(props);
    // 初始化状态数据
    this.state = {
      cartData: [], // 购物车数据
    };
    // 绑定 this
    this.initCartData = this.initCartData.bind(this);
    this.renderCartFlow = this.renderCartFlow.bind(this);
  }

  // 组件装载
  componentDidMount() {
    this.initCartData(); // 初始化购物车数据
  }

  /**
   * 初始化购物车数据
   */
  initCartData() {
    // 处理数据函数
    const processData = (res) => {
      console.log('返回数据:', res);
      if (res && res.length > 0) {
        // 处理数据
        this.setState(
          {
            cartData: res,
          }
        );
      } else {
        return;
      }
    }
    // 请求数据
    this.cartWebService.getCart(
      {
        // 传输参数
        params: null,
        // 成功回调函数
        success: (res) => {
          processData(res);
        },
      }
    );
  }

  /**
   * 渲染购物车界面
   */
  renderCartFlow() {
    let cartShopList = [];
    if (this.state.cartData && this.state.cartData.length > 0) {
      this.state.cartData.forEach(
        (elem, index) => {
          cartShopList.push(
            <CartShopItem
              key={`${elem.shopThinResponse.shopId}-${Math.random().toString().substr(2, 5)}`}
              cartShopData={elem}
              cartWebService={this.cartWebService}
              initCartData={this.initCartData}
            />
          );
        }
      );
      return cartShopList;
    } else {
      return null;
    }
  }

  render() {
    // 路由变量
    const { history, match, location } = this.props;

    return (
      <div
        className="cart-layout"
        style={{
          width: document.documentElement.clientWidth
        }}
      >
        <StickyContainer>
          {/** 顶部粘滞菜单栏 */}
          <Sticky>
            {({ style }) =>
              <div style={{ ...style, zIndex: 1 }}>
                {/** 从非Tab导航跳转到购物差显示导航栏 */}
                <NavBar
                  mode="light"
                  icon={<Icon type="left" />}
                  // 点击左侧返回按钮返回首页
                  onLeftClick={() => { history.goBack(); }}
                >
                  购物车
                </NavBar>
              </div>
            }
          </Sticky>
          {/* 页面内容区域 */}
          <div className="cart-main" >
            {/** 购物车内容流 */}
            <div className="cart-flow">
              {/** 购物车条目 */}
              {this.renderCartFlow()}
            </div>
          </div>
        </StickyContainer>
      </div>
    );
  }
}

Cart = withRouter(Cart);

/**
 * 购物车店铺块
 */
class CartShopItem extends React.Component {

  constructor(props) {
    super(props);
    // 绑定 this
    this.settlementAmount = this.settlementAmount.bind(this);
    this.emptyCartShop = this.emptyCartShop.bind(this);
  }

  /**
   * 计算商品价格
   */
  settlementAmount() {
    let totalPrice = 0;
    if (this.props.cartShopData.shoppingCartLine && this.props.cartShopData.shoppingCartLine.length > 0) {
      this.props.cartShopData.shoppingCartLine.forEach(
        (elem) => {
          totalPrice += parseInt(elem.quantity) * parseFloat(elem.price).toFixed(2);
        }
      );
    }
    return totalPrice.toFixed(2);
  }

  /**
   * 清空购物车店铺下商品信息
   */
  emptyCartShop(emptyShopId) {
    this.props.cartWebService.clearCartByShopId(
      {
        // 传输参数
        params: {
          shopIdList: [emptyShopId],
        },
        // 成功回调函数
        success: (res) => {
          this.props.initCartData();
          Toast.success('成功清空');
        },
      }
    );
  }

  /**
   * 路由跳转函数
   * @param {string} location - 路由地址
   */
  gotoRouteLocation(location) {
    const { history } = this.props;
    history.push(location);
  }

  render() {
    return (
      <div className="cart-item" >
        {/** 店铺信息 */}
        <div className="cart-item__shop">
          <div
            className="cart-item__shop-info"
            onClick={(event) => {
              this.gotoRouteLocation(`/route/shopDetail?shopId=${this.props.cartShopData.shopThinResponse.shopId}`);
            }}
          >
            {/** 店铺名 */}
            <span className="cart-item__shop-info__name">
              {this.props.cartShopData.shopThinResponse.name}
            </span>
            {/** 右箭头 */}
            <div className="cart-item__shop-info__into">
              <Icon type="right" />
            </div>
          </div>
        </div>
        {/** 店铺下的商品 */}
        <div className="cart-item__goods">
          {
            this.props.cartShopData.shoppingCartLine.map(
              (elem) => (
                /** 每个商品项 */
                <CartGoodsItem
                  key={`${elem.shoppingCartId}-${Math.random().toString().substr(2, 5)}`}
                  cartGoodsData={elem}
                  cartWebService={this.props.cartWebService}
                  initCartData={this.props.initCartData}
                />
              )
            )
          }
        </div>
        {/** 订单操作 */}
        <div className="cart-item__action">
          {/** 清空当前店铺商品按钮 */}
          <div className="cart-item__action-clear">
            <div
              className="cart-item__action-clear__btn"
              onClick={(event) => {
                event.stopPropagation();
                this.emptyCartShop(this.props.cartShopData.shopThinResponse.shopId);
              }
              }
            >
              清空商品
            </div>
          </div>
          {/** 结算按钮 */}
          <div className="cart-item__action-settlement">
            <div className="cart-item__action-settlement__text">
              <span>￥</span>
              <span className="cart-item__action-settlement__text-money">
                {/** 商品结算价格 */}
                {this.settlementAmount()}
              </span>
            </div>
            <div className="cart-item__action-settlement__btn">
              去结算
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CartShopItem = withRouter(CartShopItem);

/**
 * 购物车商品
 */
class CartGoodsItem extends React.Component {

  constructor(props) {
    super(props);
    // 绑定 this
    this.deleteGoodsItem = this.deleteGoodsItem.bind(this);
  }

  /**
   * 删除商品条目
   */
  deleteGoodsItem(deleteGoodsItemId) {
    // 调用删除商品服务
    this.props.cartWebService.updateCart(
      {
        // 传输参数
        params: {
          itemId: deleteGoodsItemId, // 删除商品的编号
          quantity: -1,
        },
        // 成功回调函数
        success: (res) => {
          this.props.initCartData();
          Toast.success('删除成功');
        },
      }
    );
  }

  render() {

    // 渲染商品属性信息
    const renderGoodsAttributes = (attributesObject) => {
      if (attributesObject && Object.keys(attributesObject).length > 0) {
        return Object.keys(attributesObject).map(
          (elem) => (<span className="cart-item__goods-content__attribute-item">{attributesObject[elem]}</span>)
        );
      } else {
        return null;
      }
    }
    // 判断当前数据是否为空，为空则不进行渲染
    if (this.props.cartGoodsData) {
      return (
        <div className="cart-item__goods-item">
          {/** 编辑区域 */}
          <div className="cart-item__edit">
            {/** 删除按钮 */}
            <div
              className="cart-item__edit-item"
              onClick={(event) => {
                event.stopPropagation();
                this.deleteGoodsItem(this.props.cartGoodsData.itemId);
              }}
            >
              <div className="cart-item__edit-item__delete-icon">
                <Icon type={'cross-circle'} size="xs" />
              </div>
            </div>
          </div>
          {/** 商品内容区域 */}
          <div className="cart-item__goods-main">
            {/** 商品图片预览图 */}
            <div className="cart-item__goods-thumb">
              <img alt="Goods" className="cart-item__goods-thumb__img"
                src={this.props.cartGoodsData.itemImage ? this.props.cartGoodsData.itemImage : null}
              />
            </div>
            {/** 商品信息 */}
            <div className="cart-item__goods-content">
              <div className="cart-item__goods-content__top">
                <span className="cart-item__goods-content__name">
                  {this.props.cartGoodsData.itemName}
                </span>
              </div>

              <div className="cart-item__goods-content__middle">
                {renderGoodsAttributes(this.props.cartGoodsData.itemAttribute)}
              </div>

              <div className="cart-item__goods-content__bottom">
                <span className="cart-item__goods-content__quantity">
                  x<span className="cart-item__goods-content__quantity-text">
                    {this.props.cartGoodsData.quantity}
                  </span>
                </span>
                <span className="cart-item__goods-content__price">
                  ￥<span className="cart-item__goods-content__price-text">
                    {this.props.cartGoodsData.price ? this.props.cartGoodsData.price.toFixed(2) : 0.00}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }

  }
}
