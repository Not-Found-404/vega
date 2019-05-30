import React from 'react';
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import { StickyContainer, Sticky } from 'react-sticky';
import PropTypes from "prop-types";
import { NavBar, Icon, Tabs } from 'antd-mobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { ShopWebService } from '../../../service/shop/shop.web.service'
import './shop-detail.css';


const tabs = [
  { title: 'First Tab' },
  { title: 'Second Tab' },
  { title: 'Third Tab' },
];

function renderTabBar(props) {
  return (
    <Sticky>
      {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>
  );
}

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
    if(tagsData.length > 0){
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
                    星巴克 - 皇家理工旗舰店
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
                    <img className="shop-header__info-thumb-img" alt="Shop" src={this.state.shopInfoData ? this.state.shopInfoData.imageUrl : ''} />
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
                  <Tabs tabs={tabs}
                    initalPage={'1'}
                    renderTabBar={renderTabBar}
                  >
                    <div style={{ display: 'flex', height: '100em', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                      Content of first tab
                  </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                      Content of second tab
                  </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                      Content of third tab
                  </div>
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
