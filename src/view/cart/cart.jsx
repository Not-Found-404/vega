import React from 'react';
import './cart.css';
import classnames from 'classnames'; // className 操作库
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Sticky, StickyContainer } from 'react-sticky';
import { Icon, ListView, Modal, NavBar, Checkbox, Toast } from 'antd-mobile';

export class Cart extends React.Component {
  constructor(props) {
    super(props);
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
              <div className="cart-item" >
                {/** 店铺信息 */}
                <div className="cart-item__shop">
                  {/** 编辑区域 */}
                  <div className="cart-item__edit">
                    {/** 选中按钮 */}
                    <div className="cart-item__edit-item cart-item__edit-item__check">
                      <div className="cart-item__edit-item__check-icon cart-item__edit-item__check-icon__check">
                        <Icon type={'check'} size="xxs" />
                      </div>
                    </div>
                  </div>
                  <div className="cart-item__shop-info">
                    {/** 店铺名 */}
                    <span className="cart-item__shop-info__name">
                      星巴克 - 皇家理工旗舰店
                    </span>
                    {/** 右箭头 */}
                    <div className="cart-item__shop-info__into">
                      <Icon type="right" />
                    </div>
                  </div>
                </div>
                {/** 店铺下的商品 */}
                <div className="cart-item__goods">
                  {/** 每个商品项 */}
                  <div className="cart-item__goods-item">
                    {/** 编辑区域 */}
                    <div className="cart-item__edit">
                      {/** 选中按钮 */}
                      <div className="cart-item__edit-item cart-item__edit-item__check">
                        <div className="cart-item__edit-item__check-icon">
                          {/* <Icon type={'check'} size="xxs" /> */}
                        </div>
                      </div>
                      {/** 删除按钮 */}
                      <div className="cart-item__edit-item">
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
                          src={'https://img.meituan.net/msmerchant/a9e5f3a04061c1be252551380d208e2a519326.jpg'}
                        />
                      </div>
                      {/** 商品信息 */}
                      <div className="cart-item__goods-content">
                        <div className="cart-item__goods-content__top">
                          <span className="cart-item__goods-content__name">
                            抹茶星冰乐，加糖，加冰，加芝士
                          </span>
                        </div>
                        <div className="cart-item__goods-content__bottom">
                          <span className="cart-item__goods-content__quantity">
                            x<span className="cart-item__goods-content__quantity-text">{15}</span>
                          </span>
                          <span className="cart-item__goods-content__price">
                            ￥<span className="cart-item__goods-content__price-text">{21.5}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/** 订单操作 */}
                <div className="cart-item__action">
                  {/** 清空当前店铺商品按钮 */}
                  <div className="cart-item__action-clear">
                    <div className="cart-item__action-clear__btn">
                      清空商品
                    </div>
                  </div>
                  {/** 结算按钮 */}
                  <div className="cart-item__action-settlement">
                    <div className="cart-item__action-settlement__text">
                      <span>￥</span>
                      <span className="cart-item__action-settlement__text-money">
                        {36.78}
                      </span>
                    </div>
                    <div className="cart-item__action-settlement__btn">
                      去结算
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </StickyContainer>
      </div>
    );
  }
}
