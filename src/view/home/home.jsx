import React from 'react';
import ReactDOM from 'react-dom'
import { Carousel, WingBlank, Flex, ListView, WhiteSpace, Card } from 'antd-mobile';
import './home.css';

// 组件变量定义
const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];
const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 0) {
  for (let i = 0; i < NUM_SECTIONS; i++) {
    const ii = (pIndex * NUM_SECTIONS) + i;
    const sectionName = `Section ${ii}`;
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
    rowIDs[ii] = [];

    for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
      const rowName = `S${ii}, R${jj}`;
      rowIDs[ii].push(rowName);
      dataBlobs[rowName] = rowName;
    }
  }
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}

export class Home extends React.Component {


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
      imgHeight: 176, // 跑马灯图片高度
      shopListData, // 店铺列表数据
      shopListIsLoading: true, // 店铺列表加载状态
      height: document.documentElement.clientHeight * 3 / 4, // 店铺列表图片高度
    }
  }


  // 组件生命周期 - 组件挂载
  componentDidMount() {
    // 跑马灯图片加载
    setTimeout(() => {
      this.setState({
        carouselData: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
      });
    }, 100);

    // 店铺列表加载
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    setTimeout(() => {
      genData(); // 生成店铺列表数据
      this.setState({
        // 店铺列表数据加载
        shopListData: this.state.shopListData.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        shopListIsLoading: false, // 店铺列表加载状态
        height: hei,
      });
    }, 600);
  }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.shopListIsLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ shopListIsLoading: true });
    setTimeout(() => {
      genData(++pageIndex);
      this.setState({
        shopListData: this.state.shopListData.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        shopListIsLoading: false,
      });
    }, 1000);
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );

    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          <div
            style={{
              lineHeight: '50px',
              color: '#888',
              fontSize: 18,
              borderBottom: '1px solid #F6F6F6',
            }}
          >{obj.title}</div>
          <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
            <img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt="" />
            <div style={{ lineHeight: 1 }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.des}</div>
              <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>35</span>¥ {rowID}</div>
            </div>
          </div>
        </div>
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
                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
              >
                <img
                  src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                    this.setState({ imgHeight: 'auto' });
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

        <Card full>
          <Card.Header title="好店推荐" />
          <Card.Body className="card-body">
            {/* 店铺列表 */}
            <ListView
              ref={el => this.lv = el}
              dataSource={this.state.shopListData}
              renderHeader={() => <span>header</span>}
              renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                {this.state.shopListIsLoading ? 'Loading...' : 'Loaded'}
              </div>)}
              renderSectionHeader={sectionData => (
                <div>{`Task ${sectionData.split(' ')[1]}`}</div>
              )}
              renderBodyComponent={() => <MyBody />}
              renderRow={row}
              renderSeparator={separator}
              style={{
                height: this.state.height,
                overflow: 'auto',
              }}
              pageSize={4}
              onScroll={() => { console.log('scroll'); }}
              scrollRenderAheadDistance={500}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
            />

          </Card.Body>

        </Card>

      </div>

    );
  }
}

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}
