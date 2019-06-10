import React from 'react';
import { Route } from "react-router-dom";
/** 路由组件 - 声明区域 - start */
import { ShopDetail } from '../../../component/shop/detail/shop-detail';
import { ShopSearch } from '../../../component/shop/search/shop-search';
import {OrderDetail} from "../../../component/order/order.detail";
import {CommentCreate} from "../../../component/order/comment.create";
// import { Settlement } from  '../../../component/settlement/settlement';
/** 路由组件 - 声明区域 - end */
import './layout.css';

export class LayoutRoute extends React.Component {
  render() {
    return (
      <div
        className="layout-route"
        style={{ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }}
      >
        {/* 顶级层次容器路由切换区域 */}
        <Route path="/route/shopDetail/" component={ShopDetail} />
        <Route path="/route/shopSearch/" component={ShopSearch} />
        <Route path="/route/orderDetail/:orderId" component={OrderDetail} />
        <Route path="/route/commentCreate/:orderId" component={CommentCreate} />
        {/** 购物车结算页面 */}
        {/* <Route path="/route/settlement" component={ Settlement } /> */}
      </div>
    );
  }
}
