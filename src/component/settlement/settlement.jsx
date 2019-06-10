import React from 'react';
import './settlement.css';
import classnames from 'classnames'; // className 操作库
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { createForm } from 'rc-form';
import { Sticky, StickyContainer } from 'react-sticky';
import { Icon, Modal, NavBar, Toast, List, InputItem } from 'antd-mobile';
import { CartWebService } from '../../service/cart/cart.web.service';

export class Settlement extends React.Component {
  constructor(props) {
    super(props);
    // 初始化获取店铺编号
    const { location, match, history } = this.props;
    // console.log('location:', location, '\nmatch:', match, '\nhistory:', history);
    let param = new URLSearchParams(location.search);
    this.state = {
      shopId: param.get('shopId') ? param.get('shopId') : null,
    }
  }

  componentDidMount() {

  }

  render() {
    // 路由导航对象
    const { location, match, history } = this.props;
    // 判断当前的店铺信息是否有效
    if (this.state.shopId) {
      return (
        <div
          className="settlement-layout"
          style={{
            width: document.documentElement.clientWidth
          }}
        >
          {/** 粘滞容器 */}
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
                  >
                    订单结算
                  </NavBar>
                </div>
              }
            </Sticky>
            {/** 页面内容区域 */}
            <div className="settlement-main">
              {/** 结算内容流 */}
              <div className="settlement-flow">

                {/** 购物车结算项 */}
                <div className="settlement-item" >
                  {/** 店铺内容区域 */}
                  <div className="settlement-item__shop">
                    {/** 店铺信息 */}
                    <div className="settlement-item__shop-info" >
                      {/** 店铺名 */}
                      <span className="settlement-item__shop-info__name">
                        {'星巴克 - 皇家理工大学旗舰店'}
                      </span>
                    </div>
                  </div>
                  {/** 店铺下的商品 */}
                  <div className="settlement-item__goods">
                    {/** 商品项 */}
                    <div className="settlement-item__goods-item">
                      {/** 商品内容区域 */}
                      <div className="settlement-item__goods-main" >
                        {/** 商品图片预览图 */}
                        <div className="settlement-item__goods-thumb">
                          <img alt="Goods" className="settlement-item__goods-thumb__img"
                            src={'https://img.meituan.net/msmerchant/33cb86127111e2a3bbfd47717102f86b541476.jpg'}
                          />
                        </div>
                        {/** 商品信息 */}
                        <div className="settlement-item__goods-content">
                          <div className="settlement-item__goods-content__top">
                            <span className="settlement-item__goods-content__name">
                              {'抹茶星冰乐 - 秋季特供'}
                            </span>
                          </div>

                          <div className="settlement-item__goods-content__middle">
                            商品属性区域
                          </div>

                          <div className="settlement-item__goods-content__bottom">
                            <span className="settlement-item__goods-content__quantity">
                              x<span className="settlement-item__goods-content__quantity-text">
                                {'12'}
                              </span>
                            </span>
                            <span className="settlement-item__goods-content__price">
                              ￥<span className="settlement-item__goods-content__price-text">
                                {'32.5'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </StickyContainer>
        </div>
      );
      // 无效返回空信息
    } else {
      return null;
    }

  }
}
// 转化为路由组件
Settlement = withRouter(Settlement);
