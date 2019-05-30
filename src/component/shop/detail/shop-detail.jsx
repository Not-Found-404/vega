import React from 'react';
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import { StickyContainer, Sticky } from 'react-sticky';
import classnames from 'classnames'; // className 操作库
import PropTypes from "prop-types";
import { NavBar, Icon, Tabs, ListView } from 'antd-mobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { ShopWebService } from '../../../service/shop/shop.web.service'
import './shop-detail.css';

export class ShopDetail extends React.Component {
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
                    onLeftClick={() => { history.push('/tab/home/'); }}
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
                    tabs={[{ title: '点餐' }, { title: '评价' }]} // tab数据
                    initalPage={1} // 初始化Tab, index or key
                    renderTabBar={renderTabBar} // 替换TabBar
                  >
                    {/* 点餐界面 */}
                    <Order
                      // 传递店铺类目数据
                      shopCategoryData={this.state.shopInfoData ? this.state.shopInfoData.shopCategoryDetailResponseList : null}
                    />
                    {/* 评价界面 */}
                    <Remark />
                  </Tabs>
                </StickyContainer>
              </div>
            </div>
          </StickyContainer>
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
      shopCategorySelectIndex: 0,
    }

    // 绑定 this
    this.processShopCategoryData = this.processShopCategoryData.bind(this);
    this.initShopGoodsData = this.initShopGoodsData.bind(this);
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
    this.initShopGoodsData(this.state.shopCategorySelectIndex);
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
          categoryRowIDs[0].push(index);
          dataBlobs[index] = index;
        }
      );
      this.setState(
        {
          shopCategoryListViewData: this.state.shopCategoryListViewData.cloneWithRowsAndSections(dataBlobs, categorySectionIDs, categoryRowIDs), // ReactNative 克隆视图数据
        }
      );
    } else {
      return;
    }
  }

  /**
   * 初始化店铺类别商品
   */
  initShopGoodsData(shopCategoryIndex) {
    // 处理店铺类别商品列表数据映射
    let goodsSectionIDs = [];
    let goodsRowIDs = [];
    let dataBlobs = {};
    if (this.state.shopCategoryListData.length > 0) {
      goodsSectionIDs.push('goodsListSection 1');
      goodsRowIDs.push([]);
      dataBlobs['goodsListSection 1'] = 'goodsListSection 1';
      let shopCategoryGoods = this.state.shopCategoryListData[shopCategoryIndex].itemThinResponseList;
      shopCategoryGoods.forEach(
        (current, index) => {
          goodsRowIDs[0].push(index);
          dataBlobs[index] = index;
        }
      );
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
  selectedCategoryChange = (index) => {
    this.setState(
      {
        shopCategorySelectIndex: index,
      }
    );
    this.initShopGoodsData(index);
  }

  render() {

    // 从数据源(data source)中接受一条数据，以及它和它所在 section 的 ID。返回一个可渲染的组件来为这行数据进行渲染。
    const shopCategoryItemRender = (rowData, sectionID, rowID) => {
      let shopCategoryItemClass = classnames({
        'order-category__item-category': true,
        'order-category__item-category__select': this.state.shopCategorySelectIndex === rowID,
      });
      // console.log('渲染行数据源:\nrowData:', rowData, 'sectionId:', sectionID, 'rowId:', rowID);
      return (
        <div
          className={shopCategoryItemClass} key={rowID}
          onClick={() => { this.selectedCategoryChange(rowID) }}
        >
          {this.state.shopCategoryListData[rowID].name}
        </div>
      );
    };

    // 从数据源(data source)中接受一条数据，以及它和它所在 section 的 ID。返回一个可渲染的组件来为这行数据进行渲染。
    const shopGoodsItemRender = (rowData, sectionID, rowID) => {
      // console.log('渲染行数据源:\nrowData:', rowData, 'sectionId:', sectionID, 'rowId:', rowID);
      return (
        <div
          className='order-goods__item' key={rowID}
        >
          <div className="order-goods__thumb">
            <img
              className="order-goods__thumb-img" alt="Goods"
              src="https://img.meituan.net/msmerchant/a9e5f3a04061c1be252551380d208e2a519326.jpg"
            />
          </div>
          <div className="order-goods__content">
            <div className="order-goods__content-name">
              焦糖拿铁星冰乐
            </div>
            <div className="order-goods__content-advertise">
              爱上这口沉醉，咖啡融合冰激凌
            </div>
            <div className="order-goods__content-sale">
              <div className="order-goods__content-left">
                <div className="order-goods__content-info">

                </div>
                <div className="order-goods__content-price">

                </div>
              </div>
              <div className="order-goods__content-right">

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
