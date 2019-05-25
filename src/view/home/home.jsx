import React from 'react';
import ReactDOM from 'react-dom';
import { Carousel, WingBlank, Flex, ListView, WhiteSpace, Card } from 'antd-mobile';
import { ShopWebService } from '../../service/shop/shop.web.service';
import './home.css';

// 常量
const NUM_ROWS_PER_SECTION = 5;  // 每个 Section 的 Row 数量
const CAROUSEL_IMG_HEIGHT = 230;

export class Home extends React.Component {
  // 组件参数
  shopWebService = new ShopWebService();
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
      carouselData: ['1', '2', '3'], // 跑马灯图片数据
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
      dataBlobs: {},
    }

    // 绑定 this
    this.getShopListData = this.getShopListData.bind(this);

  }

  // 组件生命周期 - 组件挂载
  componentDidMount() {
    // 跑马灯图片加载
    setTimeout(() => {
      this.setState({
        carouselData: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
      });
    }, 100);
    // 初始化店铺列表高度
    this.setState(
      {
        shopListHeight: document.documentElement.clientHeight * 3 / 4, // 店铺列表图片高度
      }
    );
    let clientHeight = document.documentElement.clientHeight;
    let offsetHeight = 210 + CAROUSEL_IMG_HEIGHT;
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
   * 获取店铺列表信息 - 列表每次到达底部调用一次
   */
  getShopListData() {
    console.log('当前页码:', this.state.pageIndex);
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
      console.log(res);
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
      let dataBlobs = this.state.dataBlobs;
      if (pageIndex === 1) {
        sectionIDs.push('shopListSection 1');
        rowIDs.push([]);
        dataBlobs['shopListSection 1'] = 'shopListSection 1';
      }
      if (pageIndex <= totalPageNum) {
        // 请求下一个分页
        for (let rowIndex = (pageIndex - 1) * NUM_ROWS_PER_SECTION;
          rowIndex < (pageIndex * NUM_ROWS_PER_SECTION) - totalPageNum % NUM_ROWS_PER_SECTION;
          rowIndex++
        ) {
          // 装载数据索引映射
          rowIDs[0].push(rowIndex);
          dataBlobs[rowIndex] = rowIndex;
        }
      };
      console.log('sectionIDs:', sectionIDs, '\nrowIDs:', rowIDs);

      // 计算当前渲染的列表高度，从而动态改变店铺列表的滚动高度
      // let shopListItemHeight = ReactDOM.findDOMNode(this.refs.shopListItem);
      // if(){

      // }
      // 存储数据
      this.setState(
        {
          shopListViewData: shopListViewData,
          shopListTotalNumber: res.total,
          shopListIsLoading: false,
          dataBlobs: dataBlobs,
          shopListData: this.state.shopListData.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs), // ReactNative 克隆视图数据
          // shopListHeight:
        }
      );
    }

    /**
     * 请求店铺列表信息数据
     */
    this.shopWebService.shopPaging(
      {
        params: {
          pageNo: pageIndex,
          pageSize: 5,
        },
        success: processData,
      }
    );
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
      console.log('渲染行数据源:\nrowData:', rowData, 'sectionId:', sectionID, 'rowId:', rowID);
      return (
        <ShopListRowItemRender
          rowData={rowData} sectionID={sectionID} rowID={rowID}
          shopItemData={this.state.shopListViewData[rowID]}
        />
      );
    };

    return (
      <div className="home-layout">
        {/* 跑马灯轮播图 */}
        <div className="home-carousel">
          <Carousel
            autoplay={false}
            infinite
            beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
            afterChange={index => console.log('slide to', index)}
          >
            {this.state.carouselData.map(val => (
              <a
                key={val}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: CAROUSEL_IMG_HEIGHT }}
              >
                <img
                  src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                  alt=""
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
                <div className="menu-container">
                  <div className="menu-item">

                  </div>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className="menu-container">
                  <div className="menu-item">

                  </div>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className="menu-container">
                  <div className="menu-item">

                  </div>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className="menu-container">
                  <div className="menu-item">

                  </div>
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
              pageSize={4}
              // 在滚动的过程中，每帧最多调用一次此回调函数。调用的频率可以用 scrollEventThrottle 属性来控制。
              onScroll={() => { console.log('滚动事件触发'); }}
              // 当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
              scrollRenderAheadDistance={500}
              // 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足 onEndReachedThreshold 个像素的距离时调用
              onEndReached={this.onEndReached}
              // 调用 onEndReached 之前的临界值
              onEndReachedThreshold={10}
            />

          </Card.Body>

        </Card>

      </div>

    );
  }
}

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

  componentDidMount(){
    console.log('DOM 元素高度:', this.shopListItem.current.clientHeight);
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
