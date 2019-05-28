import React from 'react';
import { Route, withRouter } from "react-router-dom";
import { ShopDetail } from '../../../component/shop/detail/shop-detail';
import { StickyContainer } from 'react-sticky';
import './layout.css';

export class LayoutRoute extends React.Component {

  componentDidMount() {

  }

  render() {
    return (
      <div
        className="layout-route"
        style={{ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }}
      >
        <StickyContainer>
          {/* 顶级层次容器路由切换区域 */}
          <Route path="/route/shopDetail/" component={ShopDetail} />

        </StickyContainer>
      </div>
    );
  }
}
