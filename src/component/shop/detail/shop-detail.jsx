import { faEnvelope, faPhone, faPlusCircle, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon, ListView, Modal, NavBar, Tabs, Toast, InputItem, List } from 'antd-mobile';
import classnames from 'classnames'; // className 操作库
import PropTypes from "prop-types";
import React from 'react';
import { createForm } from 'rc-form';
import { withRouter } from "react-router-dom";
import { Sticky, StickyContainer } from 'react-sticky';
import { CartWebService } from '../../../service/cart/cart.web.service';
import { ShopWebService } from '../../../service/shop/shop.web.service';
import './shop-detail.css';

export class ShopDetail extends React.Component {
  // 服务
  shopWebService = new ShopWebService();
  constructor(props) {
    super(props);
    // 初始化获取店铺编号
    const { location, match, history } = this.props;
    // console.log('location:', location, '\nmatch:', match, '\nhistory:', history);
    let param = new URLSearchParams(location.search);
    this.state = {
      shopId: param.get('shopId'),
      shopInfoData: null,
    }
    // 绑定 this
    this.shopItemTags = this.shopItemTags.bind(this);
    this.initShopInfo = this.initShopInfo.bind(this);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    // 初始化获取店铺信息
    this.initShopInfo();
  }

  /**
   * 初始化店铺信息
   */
  initShopInfo() {
    this.shopWebService.shopGetDetail(
      {
        params: {
          shopId: this.state.shopId
        },
        success: (res) => {
          console.log('店铺详情数据:', res);
          this.setState({
            shopInfoData: res,
          });
        },
      }
    );
  }

  /**
   * 店铺元素标签内容-函数组件
   */
  shopItemTags = (tagsData) => {
    let shopTagRender = [];
    if (tagsData.length > 0) {
      tagsData.forEach(
        (element) => {
          shopTagRender.push(
            <dd key={element.tagId} className="shopList-item__content-tags__dd">{element.name}</dd>
          );
        }
      );
      return (
        <dl className="shopList-item__content-tags__dl">
          {shopTagRender}
        </dl>
      );
    } else {
      return <span>无标签</span>
    }
  };

  /**
   * 路由跳转函数
   * @param {string} location - 路由地址
   */
  gotoRouteLocation(location){
    let history = this.props.history;
    history.push(location);
  }

  render() {
    // 路由导航对象
    const { location, match, history } = this.props;

    // 存在 shopId 加载店铺数据
    if (this.state.shopId && this.state.shopInfoData) {
      return (
        <div className="shop-layout">
          <StickyContainer>
            {/* 顶部粘滞菜单栏 */}
            <Sticky>
              {({ style }) =>
                <div style={{ ...style, zIndex: 1 }}>
                  <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    // 点击左侧返回按钮返回首页
                    onLeftClick={() => { history.goBack(); }}
                    // 右侧更多按钮
                    rightContent={[
                      <Icon key="1" type="ellipsis" />,
                    ]}
                  >
                    {this.state.shopInfoData ? this.state.shopInfoData.name : null}
                  </NavBar>
                </div>
              }
            </Sticky>

            <div className="shop-main">
              {/* 头部 */}
              <div className="shop-header">
                <div style={{ overflow: 'hidden' }}>
                  <div
                    className="shop-header__thumb-background"
                    style={{
                      backgroundImage: `url(${this.state.shopInfoData ? encodeURI(this.state.shopInfoData.imageUrl) : ''})`,
                    }}
                  >
                  </div>
                </div>

                <div className="shop-header__info">
                  <div className="shop-header__info-thumb">
                    <img className="shop-header__info-thumb-img" alt="Shop" src={this.state.shopInfoData ? encodeURI(this.state.shopInfoData.imageUrl) : ''} />
                  </div>
                  <div className="shop-header__info-name">
                    {this.state.shopInfoData ? this.state.shopInfoData.name : null}
                  </div>
                  <div className="shop-header__info-tag">
                    {this.shopItemTags(this.state.shopInfoData ? this.state.shopInfoData.tagList : [])}
                  </div>
                  <div className="shop-header__info-address">
                    {this.state.shopInfoData ? this.state.shopInfoData.address ? this.state.shopInfoData.address : '当前商家未提供地址' : '当前商家未提供地址'}
                  </div>
                  <div className="shop-header__info-contact">
                    <div className="info-contact_item">
                      <div className="info-contact_item-icon">
                        <FontAwesomeIcon icon={faPhone} size="xs" />
                      </div>
                      <div className="info-contact_item-text">
                        {this.state.shopInfoData ? this.state.shopInfoData.mobile ? this.state.shopInfoData.mobile : '空' : '空'}
                      </div>
                    </div>
                    <div className="info-contact_item">
                      <div className="info-contact_item-icon">
                        <FontAwesomeIcon icon={faEnvelope} size="xs" />
                      </div>
                      <div className="info-contact_item-text">
                        {this.state.shopInfoData ? this.state.shopInfoData.email ? this.state.shopInfoData.email : '空' : '空'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 内容区域 */}
              <div className="shop-content">
                <StickyContainer>
                  <Tabs
                  // { title: '点餐' }, { title: '评价' }
                    tabs={[{ title: '点餐' }]} // tab数据
                    initalPage={1} // 初始化Tab, index or key
                    renderTabBar={renderTabBar} // 替换TabBar
                    swipeable={false}
                  >
                    {/* 点餐界面 */}
                    <Order
                      // 传递店铺类目数据
                      shopCategoryData={this.state.shopInfoData ? this.state.shopInfoData.shopCategoryDetailResponseList : null}
                    />
                    {/* 评价界面 */}
                    {/* <Remark /> */}
                  </Tabs>
                </StickyContainer>
              </div>
            </div>
          </StickyContainer>

          {/** 跳转购物车按钮 */}
          <div
            className="shop-access__cart"
            onClick = { (event) => {
              event.stopPropagation();
              this.gotoRouteLocation('/tab/cart');
            }}
          >
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </div>
        </div>
      );
      // 不存在 shopId，不加载数据
    } else {
      return null;
    }
  }

}

ShopDetail = withRouter(ShopDetail);

/**
 * 标签页标签头渲染组件 - 粘滞顶部内容
 */
function renderTabBar(props) {
  return (
    <Sticky topOffset={-45}>
      {({ style, isSticky }) => {
        return (
          <div style={{ ...style, zIndex: 1, marginTop: isSticky ? 45 : 0 }}>
            <Tabs.DefaultTabBar {...props} />
          </div>
        );
      }
      }
    </Sticky>
  );
}

/**
 * 点餐组件
 */
class Order extends React.Component {
  // 服务
  cartWebService = new CartWebService();
  constructor(props) {
    super(props);
    // ListView 数据初始化
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
    const shopCategoryListViewData = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    const shopGoodsListViewData = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
      // 数据初始化
      shopCategoryListHeight: 0,  // 店铺类别列表初始化高度
      shopCategoryListData: this.props.shopCategoryData ? this.props.shopCategoryData : [], // 店铺类目数据
      // List View 视图映射
      shopCategoryListViewData,
      shopGoodsListViewData,
      // 选中店铺类别映射
      shopCategorySelectId: 0,
      // 店铺类别商品属性
      shopGoodsAttribute: null,
      shopSelectedGoodsId: null,
      showChooseStandardModal: false,
      shopSelectedGoodsStockQuantity: 0,
    }

    // 绑定 this
    this.processShopCategoryData = this.processShopCategoryData.bind(this);
    this.initShopGoodsData = this.initShopGoodsData.bind(this);
    this.chooseGoodsStandard = this.chooseGoodsStandard.bind(this);
    this.closeChooseGoodsStandard = this.closeChooseGoodsStandard.bind(this);
    this.addGoodsToCart = this.addGoodsToCart.bind(this);
  }

  componentDidMount() {
    // 初始化状态
    this.setState(
      {
        shopCategoryListHeight: document.documentElement.clientHeight - 87
      }
    );
    // 数据预处理
    this.processShopCategoryData();
    // 初始化店铺类目商品信息 - 默认第一个商品类目
    this.initShopGoodsData(this.state.shopCategoryListData.length > 0 ? this.state.shopCategoryListData[0].shopCategoryId : null);
  }

  /**
   * 处理店铺类目数据转换
   */
  processShopCategoryData() {
    // 处理店铺列表数据映射
    let categorySectionIDs = [];
    let categoryRowIDs = [];
    let dataBlobs = {};
    if (this.state.shopCategoryListData.length > 0) {
      categorySectionIDs.push('shopCategoryListSection 1');
      categoryRowIDs.push([]);
      dataBlobs['shopCategoryListSection 1'] = 'shopCategoryListSection 1';
      this.state.shopCategoryListData.forEach(
        (current, index) => {
          categoryRowIDs[0].push(current.shopCategoryId);
          dataBlobs[current.shopCategoryId] = current.shopCategoryId;
        }
      );
      this.setState(
        {
          shopCategorySelectId: this.state.shopCategoryListData[0].shopCategoryId,
          shopCategoryListViewData: this.state.shopCategoryListViewData.cloneWithRowsAndSections(dataBlobs, categorySectionIDs, categoryRowIDs), // ReactNative 克隆视图数据
          shopGoodsAttribute: [],  // 获取第一个类目的第一个商品的属性信息
        }
      );
    } else {
      return;
    }
  }

  /**
   * 初始化店铺类别商品
   */
  initShopGoodsData(shopCategoryId) {
    // 处理店铺类别商品列表数据映射
    let goodsSectionIDs = [];
    let goodsRowIDs = [];
    let dataBlobs = {};
    if (this.state.shopCategoryListData.length > 0 && shopCategoryId) {
      goodsSectionIDs.push(shopCategoryId);
      goodsRowIDs.push([]);
      dataBlobs[shopCategoryId] = shopCategoryId;
      let shopCategoryGoods = this.state.shopCategoryListData.filter((elem) => elem.shopCategoryId === shopCategoryId);
      // console.log('shopCategoryId:', shopCategoryId, '\nshopCategoryGoods:', shopCategoryGoods[0]);
      shopCategoryGoods[0].itemThinResponseList.forEach(
        (current) => {
          goodsRowIDs[0].push(current.itemId);
          dataBlobs[current.itemId] = current.itemId;
        }
      );
      // console.log('dataBlobs:', dataBlobs);
      this.setState(
        {
          // 通知视图更新界面
          shopGoodsListViewData: this.state.shopGoodsListViewData.cloneWithRowsAndSections(dataBlobs, goodsSectionIDs, goodsRowIDs), // ReactNative 克隆视图数据
        }
      );
    } else {
      return;
    }
  }

  /**
   * 选择店铺类别事件
   */
  selectedCategoryChange = (shopCategoryId) => {
    this.setState(
      {
        shopCategorySelectId: shopCategoryId,
      }
    );
    this.initShopGoodsData(shopCategoryId);
  }

  /**
   * 通过类别ID获取店铺类别名
   */
  getShopCategoryNameById = (shopCategoryId) => {
    let shopCategory = this.state.shopCategoryListData.filter(
      (elem) => {
        return elem.shopCategoryId === shopCategoryId;
      }
    )
    return (
      shopCategory.length > 0 ? shopCategory[0].name : null
    );
  }

  /**
   * 添加商品到购物车
   * @param {string} goodsId - 商品编号
   * @param {any} goodsAttributes - 商品属性信息
   * @author BillowsTao
   */
  addGoodsToCart(goodsId, goodsAttributes, quantity) {
    console.log('函数参数:', [].concat(...arguments));
    // 调用服务更新购物车数据
    this.cartWebService.createCartGoods(
      {
        // 传输参数
        params: {
          itemAttribute: goodsAttributes ? goodsAttributes : null, // 商品属性
          itemId: goodsId, //
          quantity: quantity > 0 ? quantity : 1,
        },
        // 成功回调函数
        success: (res) => {
          Toast.success('添加到购物车', 1);
          this.closeChooseGoodsStandard();
        },
      }
    );
  }

  /**
   * 选择商品规格
   */
  chooseGoodsStandard(selectGoodsId) {
    let _shopGoodsAttribute =
      this.state.shopCategoryListData.filter((elem) => (elem.shopCategoryId === this.state.shopCategorySelectId))[0]
        .itemThinResponseList.filter((elem) => (elem.itemId === selectGoodsId))[0].attribute;
    let _shopGoodsStockQuantity =
      this.state.shopCategoryListData.filter((elem) => (elem.shopCategoryId === this.state.shopCategorySelectId))[0]
        .itemThinResponseList.filter((elem) => (elem.itemId === selectGoodsId))[0].inventory;
    // 当前商品存在商品属性信息选择
    if (_shopGoodsAttribute && Object.keys(_shopGoodsAttribute).length > 0) {
      let _shopGoodsAttribute =
        this.state.shopCategoryListData.filter((elem) => (elem.shopCategoryId === this.state.shopCategorySelectId))[0]
          .itemThinResponseList.filter((elem) => (elem.itemId === selectGoodsId))[0].attribute;
      console.log('categoryId：', this.state.shopCategorySelectId, '\nselectGoodsId: ', selectGoodsId, "\n_shopGoodsAttribute", _shopGoodsAttribute);
      // 显示弹窗
      this.setState({
        shopSelectedGoodsId: selectGoodsId,
        shopGoodsAttribute: _shopGoodsAttribute,  //` 获取第一个类目的第一个商品的属性信息
        shopSelectedGoodsStockQuantity: typeof _shopGoodsStockQuantity === 'number' ? _shopGoodsStockQuantity : 0, // 设置当前选中商品的库存数量
        showChooseStandardModal: true,
      });
    } else {
      // 当前商品不存在商品属性信息
      this.setState({
        shopSelectedGoodsId: selectGoodsId,
        shopGoodsAttribute: {},  //` 获取第一个类目的第一个商品的属性信息
        shopSelectedGoodsStockQuantity: typeof _shopGoodsStockQuantity === 'number' ? _shopGoodsStockQuantity : 0, // 设置当前选中商品的库存数量
        showChooseStandardModal: true,
      });
    }
  }

  /**
   * 关闭选择商品规格弹出框
   */
  closeChooseGoodsStandard() {
    this.setState({
      showChooseStandardModal: false,
    });
  }

  render() {
    // 从数据源(data source)中接受一条数据，以及它和它所在 section 的 ID。返回一个可渲染的组件来为这行数据进行渲染。
    const shopCategoryItemRender = (rowData, sectionID, rowID) => {
      let shopCategoryItemClass = classnames({
        'order-category__item-category': true,
        'order-category__item-category__select': this.state.shopCategorySelectId === rowID,
      });
      // console.log('渲染行数据源:\nrowData:', rowData, 'sectionId:', sectionID, 'rowId:', rowID);
      return (
        <div
          className={shopCategoryItemClass} key={rowID}
          onClick={() => { this.selectedCategoryChange(rowID) }}
        >
          {this.getShopCategoryNameById(rowID)}
        </div>
      );
    };

    // 从数据源(data source)中接受一条数据，以及它和它所在 section 的 ID。返回一个可渲染的组件来为这行数据进行渲染。
    const shopGoodsItemRender = (rowData, sectionID, rowID) => {
      // console.log('渲染行数据源:\nrowData:', rowData, 'sectionId:', sectionID, 'rowId:', rowID);
      let shopCategoryGoodsData = this.state.shopCategoryListData.filter((elem) => elem.shopCategoryId === this.state.shopCategorySelectId)[0]
        .itemThinResponseList.filter((elem) => elem.itemId === rowID)[0];
      return (
        <div
          className='order-goods__item' key={rowID}
        >
          <div className="order-goods__thumb">
            <img
              className="order-goods__thumb-img" alt="Goods"
              src={shopCategoryGoodsData.mainImage}
            />
          </div>
          <div className="order-goods__content">
            <div className="order-goods__content-name">
              {shopCategoryGoodsData.name}
            </div>
            <div className="order-goods__content-advertise">
              {shopCategoryGoodsData.advertise}
            </div>
            <div className="order-goods__content-sale">
              <div className="order-goods__content-left">
                <div className="order-goods__content-info">
                  {/* 商品信息项 */}
                  <div className="order-goods__info-item">
                    <span>库存</span>
                    <span className="order-goods__info-stock">
                      {shopCategoryGoodsData.inventory}
                    </span>
                  </div>
                </div>
                <div className="order-goods__content-price">
                  <span className="order-goods__content-price__prefix">￥</span>
                  <span className="order-goods__content-price__content">
                    {shopCategoryGoodsData.price}
                  </span>
                </div>
              </div>
              <div className="order-goods__content-right">
                <div className="order-goods__control-item">
                  <div className="order-goods__control-buy" onClick={() => { this.chooseGoodsStandard(shopCategoryGoodsData.itemId); }}>
                    <FontAwesomeIcon className="order-goods__control-buy__icon" icon={faPlusCircle} size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="order-layout" style={{ height: this.state.shopCategoryListHeight }}>
        <div className="order-category">
          {/* 店铺类别列表 - ListView */}
          <ListView
            // 映射 ListView
            ref={el => this.shopCategoryLV = el}
            // ListView 数据源
            dataSource={this.state.shopCategoryListViewData}
            // 自定义 body 的包裹组件
            renderBodyComponent={() => <ShopCategoryListBodyContainer />}
            // 从数据源(data source)中接受一条数据，以及它和它所在 section 的 ID。返回一个可渲染的组件来为这行数据进行渲染。
            renderRow={shopCategoryItemRender}
            // 如果提供了此属性，一个可渲染的组件会被渲染在每一行下面，除了小节标题的前面的最后一行。在其上方的小节ID和行ID，以及邻近的行是否被高亮会作为参数传递进来。
            renderSeparator={null}
            // ListView 样式
            style={{
              height: this.state.shopCategoryListHeight,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
            // 每次事件循环（每帧）渲染的行数
            pageSize={5}
            // 在滚动的过程中，每帧最多调用一次此回调函数。调用的频率可以用 scrollEventThrottle 属性来控制。
            onScroll={() => { }}
            // 当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
            scrollRenderAheadDistance={500}
          />
        </div>
        <div className="order-goods">
          <ListView
            // 映射 ListView
            ref={el => this.shopGoodsLV = el}
            // ListView 数据源
            dataSource={this.state.shopGoodsListViewData}
            // 自定义 body 的包裹组件
            renderBodyComponent={() => <ShopGoodsListBodyContainer />}
            // 从数据源(data source)中接受一条数据，以及它和它所在 section 的 ID。返回一个可渲染的组件来为这行数据进行渲染。
            renderRow={shopGoodsItemRender}
            // 如果提供了此属性，一个可渲染的组件会被渲染在每一行下面，除了小节标题的前面的最后一行。在其上方的小节ID和行ID，以及邻近的行是否被高亮会作为参数传递进来。
            renderSeparator={null}
            // ListView 样式
            style={{
              height: this.state.shopCategoryListHeight,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
            // 每次事件循环（每帧）渲染的行数
            pageSize={5}
            // 在滚动的过程中，每帧最多调用一次此回调函数。调用的频率可以用 scrollEventThrottle 属性来控制。
            onScroll={() => { }}
            // 当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
            scrollRenderAheadDistance={500}
          />
        </div>
        {/* 选择商品类别-窗口组件 */}
        <ChooseGoodsStandard
          shopGoodsAttribute={this.state.shopGoodsAttribute}
          shopSelectedGoodsId={this.state.shopSelectedGoodsId}
          showChooseStandardModal={this.state.showChooseStandardModal}
          closeModal={this.closeChooseGoodsStandard}
          addGoodsToCart={this.addGoodsToCart}
          shopGoodsStockAmount={this.state.shopSelectedGoodsStockQuantity}
        />
      </div>
    );
  }
}

/**
 * 店铺类别列表容器
 */
function ShopCategoryListBodyContainer(props) {
  return (
    // 渲染自定义的区块包裹组件
    <div className="shopCategoryList-container">
      {/** 渲染组件容器-子节点 */}
      {props.children}
    </div>
  );
}

/**
 * 店铺商品列表容器
 */
function ShopGoodsListBodyContainer(props) {
  return (
    // 渲染自定义的区块包裹组件
    <div className="shopGoodsList-container">
      {/** 渲染组件容器-子节点 */}
      {props.children}
    </div>
  );
}

/**
 * 购买商品选择规格对话框
 */
class ChooseGoodsStandard extends React.Component {
  // 服务
  cartWebService = new CartWebService();
  constructor(props) {
    super(props);
    // ListView 数据初始化
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
    const shopGoodsAttributeListViewData = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    // 初始化属性状态
    this.state = {
      shopGoodsAttributeListViewData, // 商品属性视图数据
      checkOptionMap: {}, // 商品属性选项映射
      moneyKeyboardWrapProps: {}, // 输入框自定义虚拟键盘属性,用于解决软键盘滚动问题
    };

    this.initShopGoodsAttribute = this.initShopGoodsAttribute.bind(this);
    this.closest = this.closest.bind(this);
    this.onWrapTouchStart = this.onWrapTouchStart.bind(this);
    this.changeAttributeSelectOption = this.changeAttributeSelectOption.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.fixVirtualKeyboardScroll = this.fixVirtualKeyboardScroll.bind(this);
  }

  componentDidMount() {
    console.log('props:', this.props);
    this.initShopGoodsAttribute();
    // 检测设备类型，解决软键盘兼容问题
    this.fixVirtualKeyboardScroll();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 判断组件是否更新
    if ((this.props.showChooseStandardModal !== prevProps.showChooseStandardModal) && this.props.shopSelectedGoodsId) {
      console.log('props:', this.props);
      this.initShopGoodsAttribute();
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props !== state) {
      return {
        props
      };
    }
    return null;
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
   * 处理商品属性数据
   */
  initShopGoodsAttribute() {
    console.log('调用初始化');
    let categorySectionIDs = [];
    let categoryRowIDs = [];
    let dataBlobs = {};
    let checkOptionMap = {};
    let attribute = this.props.shopGoodsAttribute;
    console.log('初始化商品规格数据:\nAttribute:', attribute, '\nshopSelectedGoodsId:', this.props.shopSelectedGoodsId);
    if (attribute) {
      categorySectionIDs.push(`${this.props.shopSelectedGoodsId.toString()}-${Math.random().toString().substr(2, 4)}`);
      categoryRowIDs.push([]);
      dataBlobs[this.props.shopSelectedGoodsId] = this.props.shopSelectedGoodsId;
      Object.keys(attribute).forEach(
        (keyName, index) => {
          categoryRowIDs[0].push(keyName);
          dataBlobs[keyName] = keyName;
          checkOptionMap[keyName] = attribute[keyName][0]; // 商品规格默认选中第一项
        }
      );
      console.log('defaultCheckOptionMap:', checkOptionMap, '\ndataBlobs:', dataBlobs, '\ncategoryRowIDs:', categoryRowIDs, '\ncategorySectionIDs:', categorySectionIDs);
      this.setState(
        {
          shopGoodsAttributeListViewData: this.state.shopGoodsAttributeListViewData.cloneWithRowsAndSections(dataBlobs, categorySectionIDs, categoryRowIDs),
          checkOptionMap: checkOptionMap,
        }
      );
      // 默认初始化商品数量为1
      this.props.form.setFieldsValue({'goodsNumber': 1});
    } else {
      return;
    }
  }

  /**
   * 改变商品规格选中内容
   */
  changeAttributeSelectOption(goodsAttribute, selectedOption) {
    let _checkOptionMap = this.state.checkOptionMap;
    _checkOptionMap[goodsAttribute] = selectedOption;
    this.setState(
      {
        checkOptionMap: _checkOptionMap,
      }
    );
  }

  /**
   * 提交商品到购物车
   */
  addToCart() {
    this.props.form.validateFields((error, value) => {
      console.log(error, value);
      // 关闭模态框
      if (!error) {
        // 当前购买数量合理，可以进行购买
        if (value.goodsNumber <= this.props.shopGoodsStockAmount) {
          // 验证成功
          this.props.closeModal();
          // 提交商品到购物车
          this.cartWebService.createCartGoods(
            {
              // 传输参数
              params: {
                itemAttribute: this.state.checkOptionMap ? this.state.checkOptionMap : null, // 商品属性
                itemId: this.props.shopSelectedGoodsId, //
                quantity: value.goodsNumber,
              },
              // 成功回调函数
              success: (res) => {
                Toast.success('添加到购物车', 1);
              },
            }
          );
        } else {
          // 验证失败
          Toast.info(`库存不足${value.goodsNumber}`, 1);
        }
      } else {
        // 验证失败
        Toast.info('请输入有效的商品数量', 1);
      }
    });
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
    // 从数据源(data source)中接受一条数据，以及它和它所在 section 的 ID。返回一个可渲染的组件来为这行数据进行渲染。
    const shopGoodsAttributeItemRender = (rowData, sectionID, rowID) => {
      // console.log('渲染行数据源:\nrowData:', rowData, 'sectionId:', sectionID, 'rowId:', rowID);
      let goodsAttributeOption = this.props.shopGoodsAttribute[rowID] ? this.props.shopGoodsAttribute[rowID] : [];
      let checkOptionMapValue = this.state.checkOptionMap[rowID] ? this.state.checkOptionMap[rowID] : {};
      // console.log('sectionID:', sectionID, 'rowID:', rowID, '\n映射组:', this.state.checkOptionMap, '\nAttribute:', this.props.shopGoodsAttribute);
      /**
       * 渲染商品规格选项
       */
      const renderGoodsAttributeOption = (optionList) => {
        if (optionList) {
          return optionList.map(
            (elem, index) => {
              // 记录渲染样式
              let checkOptionClassnames = classnames({
                'selectStandard-item__option-item': true,
                'selectStandard-item__option-item__selected': checkOptionMapValue === elem,
              });
              return (
                <div
                  key={elem + Math.random().toString().substring(2, 7)}
                  className={checkOptionClassnames}
                  onClick={() => { this.changeAttributeSelectOption(rowID, elem) }}
                >
                  {elem}
                </div>
              );
            }
          );
        }
      };

      return (
        <div
          key={rowID + Math.random().toString().substring(2, 7)}
          className="selectStandard-item"
        >
          <div className="selectStandard-item__name">
            <span>{rowID}:</span>
          </div>
          <div className="selectStandard-item__option">
            {renderGoodsAttributeOption(goodsAttributeOption)}
          </div>
        </div>
      );
    };

    /**
     * 商品数量选择参数
     */
    const { getFieldProps } = this.props.form;

    return (
      <Modal
        visible={this.props.showChooseStandardModal}
        transparent
        closable
        onClose={() => { this.props.closeModal() }}
        title="选择商品规格"
        // 弹出框确认
        footer={
          [{
            text: '添加购物车',
            onPress: () => {
              this.addToCart();
            }
          }]
        }
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        afterClose={() => { }}
      >
        <div className="selectStandard-layout">
          {/** 选择商品数量组件 */}
          <div className="selectStandard-quantity">
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
          <ListView
            // 映射 ListView
            ref={el => this.shopGoodsAttributeLV = el}
            // ListView 数据源
            dataSource={this.state.shopGoodsAttributeListViewData}
            // 自定义 body 的包裹组件
            renderBodyComponent={() => <ShopGoodsAttributeListBodyContainer />}
            // 从数据源(data source)中接受一条数据，以及它和它所在 section 的 ID。返回一个可渲染的组件来为这行数据进行渲染。
            renderRow={shopGoodsAttributeItemRender}
            // 如果提供了此属性，一个可渲染的组件会被渲染在每一行下面，除了小节标题的前面的最后一行。在其上方的小节ID和行ID，以及邻近的行是否被高亮会作为参数传递进来。
            renderSeparator={null}
            // ListView 样式
            style={{
              height: '12em',
              width: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              display: (this.props.shopGoodsAttribute) && (Object.keys(this.props.shopGoodsAttribute).length > 0) ? 'block' : 'none',  // 根据是否有属性显示属性选择区域
            }}
            // 每次事件循环（每帧）渲染的行数
            pageSize={5}
            // 在滚动的过程中，每帧最多调用一次此回调函数。调用的频率可以用 scrollEventThrottle 属性来控制。
            onScroll={() => { }}
            // 当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
            scrollRenderAheadDistance={500}
          />
        </div>
      </Modal>
    );
  }
}

/** 将 ChooseGoodsStandard 转换为 受控组件 */
ChooseGoodsStandard = createForm()(ChooseGoodsStandard);

/**
 * 店铺类别列表容器
 */
function ShopGoodsAttributeListBodyContainer(props) {
  return (
    // 渲染自定义的区块包裹组件
    <div className="shopGoodsAttributeList-container">
      {/** 渲染组件容器-子节点 */}
      {props.children}
    </div>
  );
}

/**
 * 评论组件
 */
class Remark extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="remark-layout">
        <h1>评论界面</h1>
      </div>
    );
  }
}
