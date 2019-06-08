import React from 'react';
import { Icon, NavBar, Toast, SearchBar } from 'antd-mobile';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from 'classnames'; // className 操作库
import { Sticky, StickyContainer } from 'react-sticky';
import './shop-search.css';

export class ShopSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {

  }

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
            {({ style }) =>
              <div style={{ ...style }}>
                <div className="search-top">
                  <div className="search-top__search-return">
                    <div
                      className="search-top__search-return__btn"
                      // 返回路由上一级
                      onClick={() => { history.goBack(); }}
                    >
                      <Icon type="left" />
                    </div>
                  </div>
                  <SearchBar className="search-top__search-bar" placeholder="搜索商品" maxLength={8} />
                </div>
              </div>
            }
          </Sticky>
          <div className="search-content">
            <div>
              {/** 搜索页面展示区域 */}
            </div>
          </div>
        </StickyContainer>
      </div>
    );
  }
}

ShopSearch = withRouter(ShopSearch);
