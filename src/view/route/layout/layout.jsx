import React from 'react';
import { Route } from "react-router-dom";
import { ShopDetail } from '../../../component/shop/detail/shop-detail';
import { ShopSearch } from '../../../component/shop/search/shop-search';
import './layout.css';
import {OrderDetail} from "../../../component/order/order.detail";
import {CommentCreate} from "../../../component/order/comment.create";

export class LayoutRoute extends React.Component {

  componentDidMount() {

  }

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
      </div>
    );
  }
}
