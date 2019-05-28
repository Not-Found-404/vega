import React from 'react';
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Sticky } from 'react-sticky';
import { NavBar, Icon } from 'antd-mobile';
import './shop-detail.css';

export class ShopDetail extends React.Component {

  constructor(props) {
    super(props);

    // 初始化获取店铺编号
    const { location, match, history } = this.props;
    // console.log('location:', location, '\nmatch:', match, '\nhistory:', history);
    let param = new URLSearchParams(location.search);
    this.state = {
      shopId: param.get('shopId'),
    }
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {

  }

  /**
   * 初始化店铺信息
   */

  render() {
    // 路由导航对象
    const { location, match, history } = this.props;

    // 存在 shopId 加载店铺数据
    if (this.state.shopId) {
      return (
        <div className="shop-layout">

          <Sticky>
            {({
              style,
            }) => (
                <NavBar
                  mode="light"
                  icon={<Icon type="left" />}
                  // 点击左侧返回按钮返回首页
                  onLeftClick={() => { history.push('/home/'); }}
                  // 右侧更多按钮
                  rightContent={[
                    <Icon key="1" type="ellipsis" />,
                  ]}
                >
                  星巴克 - 皇家理工旗舰店
            </NavBar>
              )}
          </Sticky>


        </div>
      );
      // 不存在 shopId，不加载数据
    } else {
      return null;
    }

  }

}

ShopDetail = withRouter(ShopDetail);
