import React from 'react';
import './cart.css';
import classnames from 'classnames'; // className 操作库
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { createForm } from 'rc-form';
import { Sticky, StickyContainer } from 'react-sticky';
import { Icon, Modal, NavBar, Toast, List, InputItem } from 'antd-mobile';
import { CartWebService } from '../../service/cart/cart.web.service';
import { OrderWebService } from '../../service/order/order.web.service';

export class Cart extends React.Component {
  // 服务
  cartWebService = new CartWebService();
  orderWebService = new OrderWebService();
  constructor(props) {
    super(props);
    // 初始化状态数据
    this.state = {
      cartData: [], // 购物车数据
      showChooseAttrModal: false, // 显示选择商品属性对话框
      selectGoodsShoppingCartId: null, // 当前选中的商品订单行编号
      selectGoodsQuantity: 0, // 当前选中商品的购买数量
      showNotesInputModal: false, // 订单备注信息输入框状态变量
      createOrderData: {}, // 提交订单数据
    };
    // 绑定 this
    this.initCartData = this.initCartData.bind(this);
    this.renderCartFlow = this.renderCartFlow.bind(this);
    this.closeChooseGoodsAttrModal = this.closeChooseGoodsAttrModal.bind(this);
    this.showChooseGoodsAttrModal = this.showChooseGoodsAttrModal.bind(this);
    this.closeNotesInputModal = this.closeNotesInputModal.bind(this);
    this.showOrderNotesInputModal = this.showOrderNotesInputModal.bind(this);
    this.gotoRouteLocation = this.gotoRouteLocation.bind(this);
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
        this.renderCartFlow();
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
   * 关闭选择商品属性对话框
   */
  closeChooseGoodsAttrModal() {
    this.setState(
      {
        showChooseAttrModal: false,
      }
    );
  }

  /**
   * 显示选择商品属性对话框
   * @param {string} shoppingCartId - 当前选中的商品编号
   */
  showChooseGoodsAttrModal(shoppingCartId, cartGoodsQuantity) {
    this.setState(
      {
        selectGoodsShoppingCartId: shoppingCartId,
        selectGoodsQuantity: cartGoodsQuantity,
        showChooseAttrModal: true,
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
              showChooseGoodsAttrModal={this.showChooseGoodsAttrModal}
              // 显示订单备注输入框函数
              showOrderNotesInputModal={this.showOrderNotesInputModal}
            />
          );
        }
      );
      this.setState({
        cartShopListView: cartShopList,
      });
    } else {
      this.setState({
        cartShopListView: null,
      });
    }
  }

  /**
   * 显示订单备注输入对话框
   */
  showOrderNotesInputModal(shopId, shoppingCartLine) {
    this.setState(
      {
        createOrderData: { shopId, shoppingCartLine }, // 订单提交数据
        showNotesInputModal: true,  // 订单备注信息输入模态框状态变量
      }
    );
  }

  /**
   * 关闭订单备注输入对话框
   */
  closeNotesInputModal() {
    this.setState(
      {
        showNotesInputModal: false, // 订单备注输入框
      }
    );
  }

  /**
   * 路由跳转函数
   * @param {string} location - 路由地址
   */
  gotoRouteLocation(location){
    let history = this.props.history;
    history.push(location);
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
              {this.state.cartShopListView}
            </div>
          </div>
        </StickyContainer>
        {/** 商品数量选择对话框 */}
        <GoodsAttributesChoose
          showChooseAttrModal={this.state.showChooseAttrModal}
          closeChooseGoodsAttrModal={this.closeChooseGoodsAttrModal}
          selectGoodsShoppingCartId={this.state.selectGoodsShoppingCartId}
          selectGoodsQuantity={this.state.selectGoodsQuantity}
          cartWebService={this.cartWebService}
          initCartData={this.initCartData}
        />
        {/** 订单备注信息输入对话框 */}
        <OrderNotesInput
          showNotesInputModal={this.state.showNotesInputModal} // 订单备注信息输入框状态变量
          closeNotesInputModal={this.closeNotesInputModal} // 关闭订单备注信息输入框
          createOrderData={this.state.createOrderData}
          orderWebService={this.orderWebService}
          initCartData={this.initCartData}
          gotoRouteLocation={this.gotoRouteLocation} // 路由跳转函数
        />
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
                  showChooseGoodsAttrModal={this.props.showChooseGoodsAttrModal}
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
            <div
              className="cart-item__action-settlement__btn"
              onClick={
                // 提交订单按钮点击事件，点击按钮提交订单
                (event) => {
                  event.stopPropagation();
                  // 进行结算操作
                  this.props.showOrderNotesInputModal(
                    this.props.cartShopData.shopThinResponse.shopId, // 店铺编号
                    this.props.cartShopData.shoppingCartLine, // 购买商品项列表
                  );
                }
              }
            >
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
  deleteGoodsItem(shoppingCartId) {
    // 调用删除商品服务
    this.props.cartWebService.deleteCartGoodsByCartId(
      {
        // 传输参数
        params: {
          shoppingCartId: shoppingCartId,
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
          (elem) => (<span key={Math.random().toString().substr(2, 5)} className="cart-item__goods-content__attribute-item">{attributesObject[elem]}</span>)
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
                this.deleteGoodsItem(this.props.cartGoodsData.shoppingCartId);
              }}
            >
              <div className="cart-item__edit-item__delete-icon">
                <Icon type={'cross-circle'} size="xs" />
              </div>
            </div>
          </div>
          {/** 商品内容区域 */}
          <div
            className="cart-item__goods-main"
            onClick={(event) => { event.stopPropagation(); this.props.showChooseGoodsAttrModal(this.props.cartGoodsData.shoppingCartId, this.props.cartGoodsData.quantity); }}
          >
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

/**
 * 选择商品数量对话框
 */
class GoodsAttributesChoose extends React.Component {
  constructor(props) {
    super(props);
    // 初始化参数
    this.state = {
      moneyKeyboardWrapProps: {}, // 输入框自定义虚拟键盘属性,用于解决软键盘滚动问题
    }

    // 绑定 this
    this.closest = this.closest.bind(this);
    this.onWrapTouchStart = this.onWrapTouchStart.bind(this);
    this.fixVirtualKeyboardScroll = this.fixVirtualKeyboardScroll.bind(this);
    this.submitUpdateAttr = this.submitUpdateAttr.bind(this);
  }

  comopnentDidMount() {
    this.fixVirtualKeyboardScroll();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 判断组件是否更新
    if ((this.props.showChooseAttrModal !== prevProps.showChooseAttrModal) && this.props.selectGoodsShoppingCartId) {
      this.props.form.setFieldsValue({ 'goodsNumber': this.props.selectGoodsQuantity });
    }
  }

  /**
   * 修复 Android, iOS 点击穿透
   */
  closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  /**
   * 修复 Android, iOS 点击穿透
   */
  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = this.closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  /**
   * 修复虚拟键盘滚动穿透问题
   */
  fixVirtualKeyboardScroll() {
    // 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
    // https://github.com/ant-design/ant-design-mobile/issues/307
    // https://github.com/ant-design/ant-design-mobile/issues/163
    const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
    if (isIPhone) {
      this.setState(
        {
          moneyKeyboardWrapProps: {
            onTouchStart: event => event.preventDefault(),
          },
        }
      );
    }
  }

  /**
   * 提交修改数量的商品
   */
  submitUpdateAttr() {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        this.props.closeChooseGoodsAttrModal();
        this.props.cartWebService.updateCartGoodsQuantity(
          {
            // 传输参数
            params: {
              quantity: value.goodsNumber,
              shoppingCartId: this.props.selectGoodsShoppingCartId,
            },
            // 成功回调函数
            success: (res) => {
              Toast.success('修改成功', 1);
              this.props.initCartData();
            },
          }
        );
      } else {
        // 验证失败
        Toast.info('请输入有效的商品数量', 1);
      }
    });
  }

  render() {
    /**
     * 商品数量选择参数
     */
    const { getFieldProps } = this.props.form;

    return (
      <Modal
        visible={this.props.showChooseAttrModal}
        popup
        maskClosable
        animationType="slide-up"
        onClose={() => { this.props.closeChooseGoodsAttrModal() }}
        title="选择商品规格"
        // 弹出框确认
        footer={
          [{
            text: '确定',
            onPress: () => {
              this.submitUpdateAttr();
            }
          }]
        }
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        afterClose={() => { }}
      >
        <div className="attributeModal-layout">
          <List>
            <InputItem
              // 可控组件，进行数据绑定
              {...getFieldProps('goodsNumber', {
                // 初始化值
                initialValue: 1,
                // 校验规则
                rules: [{ required: true, message: '请输入商品数量' }],
              })}
              type={'number'}
              defaultValue={1}
              placeholder="购买商品数量"
              clear
              moneyKeyboardWrapProps={this.state.moneyKeyboardWrapProps}
            >
              数量
            </InputItem>
          </List>
        </div>
      </Modal>
    );
  }
}

/** 将 GoodsAttributesChoose 转换为 受控组件 */
GoodsAttributesChoose = createForm()(GoodsAttributesChoose);

class OrderNotesInput extends React.Component {
  constructor(props) {
    super(props);
    // 初始化参数
    this.state = {
      moneyKeyboardWrapProps: {}, // 输入框自定义虚拟键盘属性,用于解决软键盘滚动问题
    }

    // 绑定 this
    this.closest = this.closest.bind(this);
    this.onWrapTouchStart = this.onWrapTouchStart.bind(this);
    this.fixVirtualKeyboardScroll = this.fixVirtualKeyboardScroll.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
  }

  componentDidMount() {
    this.fixVirtualKeyboardScroll();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 判断组件是否更新
    if ((this.props.showNotesInputModal !== prevProps.showNotesInputModal) && this.props.createOrderData) {
      // 初始化输入框数据
      this.props.form.setFieldsValue({ 'orderNotes': null });
    }
  }

  /**
   * 店铺级别的提交订单功能 - 提交当前的店铺所有商品
   */
  submitOrder() {
    // 关闭提交订单窗口
    this.props.closeNotesInputModal();

    if (this.props.createOrderData) {
      // 验证传参数据是否合法
      // 处理提交订单数据
      let _orderLine = [];
      _orderLine = this.props.createOrderData.shoppingCartLine.map(
        (elem) => (
          {
            itemAttribute: elem.itemAttribute,
            itemId: elem.itemId,
            paidAmount: elem.price,
            quantity: elem.quantity,
          }
        )
      );
      console.log('订单备注:', this.props.form.getFieldValue('orderNotes'),
        '\n订单行数据:', _orderLine, 'shopId:', this.props.createOrderData.shopId);
      this.props.orderWebService.create(
        {
          // 传输参数
          params: {
            buyerNotes: this.props.form.getFieldValue('orderNotes'), // 订单备注
            orderLine: _orderLine, // 订单行数据
            shopId: this.props.createOrderData.shopId, // 提交订单的店铺
          },
          // 成功回调函数
          success: (res) => {
            Toast.success('成功创建订单');
            // 重新请求数据
            this.props.initCartData();
            // 路由重定向到订单页面
            this.props.gotoRouteLocation('/tab/order');
          },
        }
      );
    }
  }

  /**
   * 修复 Android, iOS 点击穿透
   */
  closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  /**
   * 修复 Android, iOS 点击穿透
   */
  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = this.closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  /**
   * 修复虚拟键盘滚动穿透问题
   */
  fixVirtualKeyboardScroll() {
    // 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
    // https://github.com/ant-design/ant-design-mobile/issues/307
    // https://github.com/ant-design/ant-design-mobile/issues/163
    const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
    if (isIPhone) {
      this.setState(
        {
          moneyKeyboardWrapProps: {
            onTouchStart: event => event.preventDefault(),
          },
        }
      );
    }
  }

  render() {
    /**
     * 商品数量选择参数
     */
    const { getFieldProps } = this.props.form;

    return (
      <Modal
        visible={this.props.showNotesInputModal}
        popup
        maskClosable
        animationType="slide-up"
        onClose={() => { this.props.closeNotesInputModal(); }}
        title="订单备注信息"
        // 弹出框确认
        footer={
          [{
            text: '提交订单',
            onPress: () => {
              this.submitOrder();
            }
          }]
        }
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        afterClose={() => { }}
      >
        <div className="notesModal-layout">
          <List>
            <InputItem
              // 可控组件，进行数据绑定
              {...getFieldProps('orderNotes', {
                // 初始化值
                initialValue: '',
              })}
              type={'string'}
              defaultValue={''}
              placeholder="订单备注信息"
              clear
              moneyKeyboardWrapProps={this.state.moneyKeyboardWrapProps}
            >
              订单备注
            </InputItem>
          </List>
        </div>
      </Modal>
    );
  }
}

/** 将 OrderNotesInput 转换为 受控组件 */
OrderNotesInput = createForm()(OrderNotesInput);
