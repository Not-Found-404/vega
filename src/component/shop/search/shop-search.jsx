import React from 'react';
import {Icon, NavBar, Toast, SearchBar, Card} from 'antd-mobile';
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import classnames from 'classnames'; // className 操作库
import {Sticky, StickyContainer} from 'react-sticky';
import './shop-search.css';
import {ShopWebService} from "../../../service/shop/shop.web.service";

export class ShopSearch extends React.Component {
  shopWebService = new ShopWebService();

  constructor(props) {
    super(props);
  }

  state = {
    shopList: []
  };

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
  }

  setData = (key) => {
    this.shopWebService.shopSearch({
      params: {
        keyword: key
      },
      success: (data) => {
        this.setState({
          shopList: data
        })
      }
    });
  };

  /**
   * 路由跳转函数
   * @param {string} location - 路由地址
   */
  gotoRouteLocation(location) {
    let history = this.props.history;
    history.push(location);
  }

  render() {

    // 路由控制属性
    let {history, location, match} = this.props;

    return (
      <div className="search-layout">
        <StickyContainer>
          {/* 顶部粘滞菜单栏 */}
          <Sticky>
            {({style}) =>
              <div style={{...style}}>
                <div className="search-top">
                  <div className="search-top__search-return">
                    <div
                      className="search-top__search-return__btn"
                      // 返回路由上一级
                      onClick={() => {
                        history.goBack();
                      }}
                    >
                      <Icon type="left"/>
                    </div>
                  </div>
                  <SearchBar onSubmit={(val)=>{
                    this.setData(val);
                  }}
                    className="search-top__search-bar" placeholder="搜索商品" maxLength={8}/>
                </div>
              </div>
            }
          </Sticky>
          <div className="search-content">
            <div>
              {/** 搜索页面展示区域 */}
              {this.getShopInfo()}
            </div>
          </div>
        </StickyContainer>
      </div>
    );
  }

  getShopInfo = () => {
    const shopView = [];
    let shopList = this.state.shopList;
    if (shopList != null && shopList.length > 0) {
      for (let i = 0; i < shopList.length; i++) {
        let shopInfo = shopList[i].shopInfo;
        let itemList = shopList[i].itemList;
        console.log(shopList[i].itemList);
        shopView.push(
          <Card onClick={() => {
            this.props.history.push('/route/shopDetail?shopId='+shopInfo.shopId);
          }}>
            <Card.Header
              title={shopInfo.name}
              thumb={shopInfo.imageUrl}
              thumbStyle={{width: "50px", height: "50px"}}
            />
            <Card.Body>
              {this.getItemList(itemList)}
            </Card.Body>
          </Card>
        )
      }
    }
    return shopView;
  };

  getItemList = (itemList) => {
    const itemView = [];
    if (itemList != null && itemList.length > 0) {
      for (let i = 0; i < itemList.length; i++) {
        let itemInfo = itemList[i];
        itemView.push(
          <Card>
            <Card.Header
              title={itemInfo.name}
              thumb={itemInfo.mainImage}
              thumbStyle={{width: "50px", height: "50px"}}
              extra={"￥"+itemInfo.price}
            />
            {/*<Card.Body style={{height:"20px"}}>*/}
            {/*  {itemInfo.advertise}*/}
            {/*</Card.Body>*/}
          </Card>
        )
      }
    }
    return itemView;
  }
}

ShopSearch = withRouter(ShopSearch);
