import React from 'react';
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Carousel, WingBlank, Flex, ListView, WhiteSpace, Card, List, Drawer, Icon } from 'antd-mobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faClipboardList, faShoppingCart, faSearch, faBars, faTag } from '@fortawesome/free-solid-svg-icons'
import { StickyContainer, Sticky } from 'react-sticky';
import { ShopWebService } from '../../service/shop/shop.web.service';
import { TagWebService } from '../../service/tag/tag.web.service';
import './home.css';

// 常量
const NUM_ROWS_PER_SECTION = 5;  // 每个 Section 的 Row 数量
const CAROUSEL_IMG_HEIGHT = 230; // 默认走马灯图片高度

export class Home extends React.Component {
  // 组件参数
  shopWebService = new ShopWebService();

  // 路由参数定义
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  /**
   * 构造函数
   * @param {any} props - 组件初始化参数
   */
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const shopListData = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      carouselData: [], // 跑马灯图片数据
      shopListData, // 店铺列表数据
      shopListIsLoading: true, // 店铺列表加载状态
      shopListHeight: 0, // 店铺列表图片高度
      /* 店铺列表请求数据控制 - start */
      pageIndex: 1,               // shopList 页面索引
      shopListTotalNumber: 0,     // shopList 数据总量
      shopListDataHasMore: false, // shopList 请求数据有无更多
      /* 店铺列表请求数据控制 - end */
      shopListViewData: [],       // shopList 视图数据
      shopListDataBlobs: {},      // shopList 数据驶入映射
      shopListSectionIDs: [],     // shopList SectionID
      shopListRowIDs: [],         // shopList RowsIDs
      shopListItemHeight: 0,      // shopList 每个元素的高度
    }

    // 绑定 this
    this.getShopListData = this.getShopListData.bind(this);
    this.getShopListItemHeight = this.getShopListItemHeight.bind(this);
    this.getCarouselData = this.getCarouselData.bind(this);
    this.restShopList = this.restShopList.bind(this);
    this.gotoRouteLocation = this.gotoRouteLocation.bind(this);
  }

  // 组件生命周期 - 组件挂载
  componentDidMount() {
    // 店铺走马灯数据加载
    this.getCarouselData();
    let clientHeight = document.documentElement.clientHeight;
    let offsetHeight = 203 + CAROUSEL_IMG_HEIGHT;
    let height = clientHeight - offsetHeight;
    this.setState(
      {
        shopListHeight: height,
      }
    );
    this.getShopListData();
  }
  /**
   * 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足 onEndReachedThreshold 个像素的距离时调用
  **/
  onEndReached = (event) => {
    // 如果当前正在加载或者没有更多数据，那么不再请求数据
    if (this.state.shopListIsLoading || !this.state.shopListDataHasMore) {
      return;
    }
    this.setState({ pageIndex: this.state.pageIndex + 1 });
    // 到达底部请求新的数据
    this.getShopListData();
  }

  /**
   * 初始化店铺列表请求
   */
  restShopList(){
    this.setState(
      {
        pageIndex: 1,
        shopListTotalNumber: 0,
        shopListDataHasMore: false,
        shopListViewData: [],
        shopListDataBlobs: {},
        shopListSectionIDs: [],     // shopList SectionID
        shopListRowIDs: [],
        shopListData: this.state.shopListData.cloneWithRowsAndSections({}, [], []), // ReactNative 克隆视图数据
      }
    );
  }

  /**
   * 获取店铺列表信息 - 列表每次到达底部调用一次
   */
  getShopListData( searchParam ) {
    // console.log('当前页码:', this.state.pageIndex, '查询携带参数:', searchParam);
    let pageIndex = this.state.pageIndex;
    let totalPageNum,  // 数据总页数
      shopListTotalNumber = this.state.shopListTotalNumber; // 数据总量
    // 判断店铺列表总数量是否为0
    if (shopListTotalNumber !== 0) {
      totalPageNum = Math.ceil(shopListTotalNumber / NUM_ROWS_PER_SECTION);
    } else {
      totalPageNum = 1;
    }
    // 设置正在请求状态
    this.setState({
      shopListIsLoading: true,
    });
    /**
     * 请求数据处理
     */
    let processData = (res) => {
      // console.log(res);
      // 处理店铺列表源数据
      let shopListViewData = this.state.shopListViewData;
      if (res.data.length > 0) {
        shopListViewData = shopListViewData.concat(res.data);
        this.setState({
          shopListDataHasMore: true,
        });
      } else {
        // 设置当前无更多数据
        this.setState({
          shopListDataHasMore: false,
          shopListIsLoading: false,
        });
        return;
      }
      // 处理店铺列表数据映射
      let sectionIDs = this.state.shopListSectionIDs;
      let rowIDs = this.state.shopListRowIDs;
      let shopListDataBlobs = this.state.shopListDataBlobs;
      if (pageIndex === 1) {
        sectionIDs.push('shopListSection 1');
        rowIDs.push([]);
        shopListDataBlobs['shopListSection 1'] = 'shopListSection 1';
      }
      if (pageIndex <= totalPageNum) {
        // 请求下一个分页
        let rowIndexLimit;
        if (pageIndex === Math.ceil(res.total / NUM_ROWS_PER_SECTION)) {
          rowIndexLimit = res.total % NUM_ROWS_PER_SECTION;
        } else {
          rowIndexLimit = NUM_ROWS_PER_SECTION;
        }
        // console.log('RowIndexLimit:', rowIndexLimit);
        for (let rowIndex = (pageIndex - 1) * NUM_ROWS_PER_SECTION;
          rowIndex < ((pageIndex - 1) * NUM_ROWS_PER_SECTION) + rowIndexLimit;
          rowIndex++
        ) {
          // 装载数据索引映射
          rowIDs[0].push(rowIndex);
          shopListDataBlobs[rowIndex] = rowIndex;
        }
      };
      // console.log('sectionIDs:', sectionIDs, '\nrowIDs:', rowIDs);
      // 存储数据
      this.setState(
        {
          shopListViewData: shopListViewData,
          shopListTotalNumber: res.total,
          shopListIsLoading: false,
          shopListDataBlobs: shopListDataBlobs,
          shopListData: this.state.shopListData.cloneWithRowsAndSections(shopListDataBlobs, sectionIDs, rowIDs), // ReactNative 克隆视图数据
        }
      );
      // 计算当前渲染的列表高度，从而动态改变店铺列表的滚动高度
      let clientHeight = document.documentElement.clientHeight - 50;
      let shopListInitHeight = clientHeight - (155 + CAROUSEL_IMG_HEIGHT);
      let shopListItemNumber = this.state.shopListViewData.length;
      let shopListRenderHeight = (shopListItemNumber * this.state.shopListItemHeight) +
        (shopListItemNumber * 8) + 35;

      // console.log('Init:', shopListInitHeight, 'Render:', shopListRenderHeight, 'Client:', clientHeight);

      if (shopListRenderHeight <= clientHeight) {
        this.setState(
          {
            shopListHeight: shopListInitHeight > shopListRenderHeight ? shopListInitHeight : shopListRenderHeight - 3,
          }
        );
      } else {
        this.setState(
          {
            shopListHeight: clientHeight,
          }
        );
      }
    }

    /**
     * 请求店铺列表信息数据
     */
    this.shopWebService.shopPaging(
      {
        params: {
          pageNo: pageIndex,
          pageSize: NUM_ROWS_PER_SECTION,
          ...searchParam,
        },
        success: processData,
      }
    );
  }


  /**
   * 获取shopList元素渲染后的高度，并进行高度记录
   */
  getShopListItemHeight(currentHeight) {
    // 更新当前高度
    this.setState(
      {
        shopListItemHeight: currentHeight
      }
    );
  }

  /**
   * 获取走马灯图片数据
   */
  getCarouselData() {
    this.shopWebService.shopBanner({
      params: null,
      success: (res) => {
        // console.log('轮播图数据:', res);
        this.setState({
          carouselData: res.list,
        });
      },
    });
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
    /**
     * 元素分隔符
     * @param {number} sectionID - 小节ID
     * @param {number} rowID - 行ID
     */
    const shopItemSeparator = (sectionID, rowID) => (
      <div
        key={`${sectionID} - ${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );

    // 从数据源(data source)中接受一条数据，以及它和它所在 section 的 ID。返回一个可渲染的组件来为这行数据进行渲染。
    const shopItemRender = (rowData, sectionID, rowID) => {
      // console.log('渲染行数据源:\nrowData:', rowData, 'sectionId:', sectionID, 'rowId:', rowID);
      return (
        <ShopListRowItemRender
          rowData={rowData} sectionID={sectionID} rowID={rowID}
          shopItemData={this.state.shopListViewData[rowID]}
          getShopListItemHeight={this.getShopListItemHeight}
          gotoRouteLocation = {this.gotoRouteLocation}
        />
      );
    };

    return (
      <div className="home-layout">

        <SearchGoods
          gotoRouteLocation={this.gotoRouteLocation}
        />
        {/* 走马灯轮播图 */}
        <div className="home-carousel">
          <Carousel
            autoplay={true}
            infinite
            beforeChange={(from, to) => {}}
            afterChange={index => {}}
            style={{ height: CAROUSEL_IMG_HEIGHT }} /* 设置走马灯容器高度，即使没有图片也保持高度 */
          >
            {/* 渲染走马灯数据 */}
            {this.state.carouselData.map(element => (
              <a
                key={element.bannerId}
                href="./"
                style={{ display: 'inline-block', width: '100%', height: CAROUSEL_IMG_HEIGHT }}
              >
                <img
                  src={element.imageUrl}
                  alt={element.name}
                  style={{ width: '100%', verticalAlign: 'top', height: CAROUSEL_IMG_HEIGHT }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                  }}
                />
              </a>
            ))}
          </Carousel>
        </div>
        <WhiteSpace size="md" />
        {/* 主页菜单 */}
        <div className="home-menu">
          <WingBlank size="md">
            <Flex justify="between">
              <Flex.Item>
                <div className="menu-container" onClick={()=>{this.gotoRouteLocation('/tab/order')}}>
                  <div className="menu-item menu-item__order">
                    <FontAwesomeIcon className="menu-item__icon" icon={faClipboardList} size="2x" />
                  </div>
                  <span className="menu-item__text">订单</span>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className="menu-container" onClick={()=>{this.gotoRouteLocation('/tab/cart')}}>
                  <div className="menu-item menu-item__cart">
                    <FontAwesomeIcon className="menu-item__icon" icon={faShoppingCart} size="2x" />
                  </div>
                  <span className="menu-item__text">购物车</span>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className="menu-container" onClick={()=>{this.gotoRouteLocation('/route/searchGoods')}}>
                  <div className="menu-item menu-item__search">
                    <FontAwesomeIcon className="menu-item__icon" icon={faSearch} size="2x" />
                  </div>
                  <span className="menu-item__text">搜索商品</span>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className="menu-container" onClick={()=>{this.gotoRouteLocation('/tab/my')}}>
                  <div className="menu-item menu-item__user">
                    <FontAwesomeIcon className="menu-item__icon" icon={faUser} size="2x" />
                  </div>
                  <span className="menu-item__text">个人中心</span>
                </div>
              </Flex.Item>
            </Flex>
          </WingBlank>
        </div>
        <WhiteSpace size="md" />
        {/* 店铺列表区域 */}

        <Card full className="shopList-card">
          <Card.Header className="shopList-card__header" title="好店推荐" />
          <Card.Body className="shopList-card__body">
            <StickyContainer>
              {/* 店铺列表 - 筛选器 */}
              <ShopListFilter
                getShopListData={this.getShopListData}
                restShopList = {this.restShopList}
              />
              {/* 店铺列表 - ListView */}
              <ListView
                // 映射 ListView
                ref={el => this.lv = el}
                // ListView 数据源
                dataSource={this.state.shopListData}
                // 渲染页脚
                renderFooter={() =>
                  (
                    <div className="shopList-footer">
                      {(this.state.shopListIsLoading && this.state.shopListDataHasMore) ? '加载中...' : '加载完成'}
                    </div>
                  )
                }
                // 自定义 body 的包裹组件
                renderBodyComponent={() => <ShopListBodyContainer />}
                // 从数据源(data source)中接受一条数据，以及它和它所在 section 的 ID。返回一个可渲染的组件来为这行数据进行渲染。
                renderRow={shopItemRender}
                // 如果提供了此属性，一个可渲染的组件会被渲染在每一行下面，除了小节标题的前面的最后一行。在其上方的小节ID和行ID，以及邻近的行是否被高亮会作为参数传递进来。
                renderSeparator={shopItemSeparator}
                // ListView 样式
                style={{
                  height: this.state.shopListHeight,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
                // 每次事件循环（每帧）渲染的行数
                pageSize={5}
                // 在滚动的过程中，每帧最多调用一次此回调函数。调用的频率可以用 scrollEventThrottle 属性来控制。
                onScroll={() => {}}
                // 当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                scrollRenderAheadDistance={500}
                // 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足 onEndReachedThreshold 个像素的距离时调用
                onEndReached={this.onEndReached}
                // 调用 onEndReached 之前的临界值
                onEndReachedThreshold={1000}
              />
            </StickyContainer>
          </Card.Body>

        </Card>

      </div>

    );
  }
}

Home = withRouter(Home);

/**
 * 店铺列表容器
 */
function ShopListBodyContainer(props) {
  return (
    // 渲染自定义的区块包裹组件
    <div className="shopList-container">
      {/** 渲染组件容器-子节点 */}
      {props.children}
    </div>
  );
}

/**
 * 店铺列表元素-渲染行元素
 */
class ShopListRowItemRender extends React.Component {
  constructor(props) {
    super(props);

    // 创建 ref
    this.shopListItem = React.createRef();

    // 绑定 this
    this.shopItemTags = this.shopItemTags.bind(this);
  }

  componentDidMount() {
    this.props.getShopListItemHeight(this.shopListItem.current.clientHeight);
  }

  /**
     * 店铺元素标签内容-函数组件
     */
  shopItemTags = (tagsData) => {
    let shopTagRender = [];
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
  };

  render() {
    return (
      <div
        ref={this.shopListItem} key={this.props.rowID}
        className="shopList-item"
        onClick={ ()=> {this.props.gotoRouteLocation(`/route/shopDetail?shopId=${this.props.shopItemData.shopId}`)}}
      >
        <div className="shopList-item__thumb">
          <img
            alt="shopImg" className="shopList-item__thumb-img"
            src={this.props.shopItemData.imageUrl}
          />
        </div>
        <div className="shopList-item__content">
          <div className="shopList-item__content-title">
            {this.props.shopItemData.name}
          </div>
          <div className="shopList-item__content-address">
            {this.props.shopItemData.address}
          </div>
          <div className="shopList-item__content-tags">
            {this.shopItemTags(this.props.shopItemData.tagThinResponse)}
          </div>
        </div>
      </div>
    );
  }
}

class SearchGoods extends React.Component {
  render() {
    return (
      <div className="search-layout">
        <WhiteSpace size="xs" />
        <div
          onClick={
            ()=>{
              this.props.gotoRouteLocation('/route/shopSearch/');
            }
          }
          className="mockSearch-container"
        >
          <div className="mockSearch-inner">
            <Icon className="mockSearch-icon" type="search" size='xs' />
            <span className="mockSearch-text">搜索商品</span>
          </div>
        </div>
        <WhiteSpace size="xs" />
      </div>
    );
  }
}

/**
 * 店铺列表筛选组件
 */
class ShopListFilter extends React.Component {

  tagWebService = new TagWebService();

  constructor(props) {
    super(props);
    // 初始化状态
    this.state = {
      silderIsOpen: false,
      tagData: []
    };

    this.onDrawerOpenChange = this.onDrawerOpenChange.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.initShopListCategory = this.initShopListCategory.bind(this);
  }

  componentDidMount() {
    this.initShopListCategory();
  }

  /**
   * 打开抽屉触发按钮
   */
  openDrawer() {
    this.setState(
      {
        silderIsOpen: true,
      }
    );
  }

  /**
   * 侧边栏打开函数
   */
  onDrawerOpenChange(openState) {
    this.setState({ silderIsOpen: openState });
  }

  /**
   * 初始化店铺类别
   */
  initShopListCategory() {
    this.tagWebService.list(
      {
        params: null,
        success: (res) => {
          // console.log('店铺标签数据:', res);
          this.setState({
            tagData: res.tagThinResponse,
          });
        },
      }
    );
  }

  /**
   * 根据店铺标签查询店铺信息
   */

  render() {
    /**
     * 初始化获取店铺列表数据
    */
    const shopListCategory = (<List>
      {
        this.state.tagData.map(
          /** 返回全部数组 */
          (currentValue, index) => {
          if (index === 0) {
            return (
              <List.Item key={index}
                thumb={<FontAwesomeIcon className="filter-menu__item-icon" icon={faTag} />}
                onClick={() => {
                    this.props.restShopList();
                    this.props.getShopListData();
                    this.setState(
                      {
                        silderIsOpen: false,
                      }
                    );
                  }
                }
              >
                全部类别
              </List.Item>
            );
          }
          return (
            <List.Item key={currentValue.tagId}
              thumb={<FontAwesomeIcon className="filter-menu__item-icon" icon={faTag} />}
              onClick={() => {
                  this.props.restShopList();
                  this.props.getShopListData({ tagId: currentValue.tagId});
                  this.setState(
                    {
                      silderIsOpen: false,
                    }
                  );
                }
              }
            >
              {currentValue.name}
            </List.Item>
          );
        })
      }
    </List>);

    return (
      <div className="filter-layout">
        <Sticky>
          {
            (
              {
                style, // Strick 传入样式
              }
            ) => {
              // 渲染筛选器界面
              return (
                <div className="filter-strick">
                  <div
                    className="filter-menu"
                    style={{
                      ...style,
                      zIndex: 4,

                    }}
                  >
                    {/* 选择分类按钮 */}
                    <div className="filter-menu__item" onClick={this.openDrawer}>
                      <FontAwesomeIcon className="filter-menu__item-icon" icon={faBars} size="1x" />
                      <div className="filter-menu__item-text">
                        类别
                      </div>
                    </div>

                  </div>
                  {/* 侧边栏 */}
                  <Drawer
                    className="filter-silder"
                    style={{ height: document.documentElement.clientHeight - 50 }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', marginTop: 50 }}
                    sidebar={shopListCategory}
                    open={this.state.silderIsOpen}
                    onOpenChange={this.onDrawerOpenChange}
                  >
                    <div style={{ display: 'none' }}></div>
                  </Drawer>
                </div>
              );
            }
          }
        </Sticky>
      </div>
    );
  }
}
