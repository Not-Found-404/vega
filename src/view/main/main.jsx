import React from 'react';
import { TabBar } from 'antd-mobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 导入 Fontawesome 图标库
import { faUser, faClipboardList, faHome, faShoppingCart } from '@fortawesome/free-solid-svg-icons';      // 导入 Fontawesome 图标库
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Home } from "../home/home";
import { Order } from "../order/order";
import { My } from "../my/my";
import { Cart } from '../cart/cart';
import { LayoutRoute } from '../route/layout/layout';
import { UserWebService } from '../../service/user/user.web.service'
import './main.css';

export class MainLayout extends React.Component {
  render() {
    return (
      <Router>
        <Main />
      </Router>
    );
  }
}

class Main extends React.Component {
  // 组件参数
  userWebService = new UserWebService();

  constructor(props) {
    super(props);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    // 默认路由跳转到 Tab 页
    this.props.history.push('/tab/home/');
    // 登录用户
    this.userWebService.login(
      {
        params: {
          mobile: "17845647879",
          password: "1",
        },
        success: (data) => { }
      }
    );
  }

  render() {
    const { match, location, history } = this.props;
    return (
      <div className="layout">
        {/** 全局路由切换区域 */}
        <Route path="/tab/" component={TabLayout} /> {/* Tab页路由 */}
        <Route path="/route/" component={LayoutRoute} /> {/* 全局路由区域 */}
      </div>
    );
  }
}

Main = withRouter(Main);

class TabLayout extends React.Component {
  // 查询地址库
  queryString = require('query-string');

  constructor() {
    super();
    this.state = {
      selectedTab: null, // 选中的 Tab 页
      tabHidden: false   // Tab 是否隐藏
    };
    // 绑定 this
    this.changeRoute = this.changeRoute.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    // 装载组件进行 Tab 跳转
    this.changeRoute();
    // 默认路由跳转
    this.props.history.push('/tab/home/');
    this.changeTab();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 判断组件是否更新
    if (this.props !== prevProps) {
      this.changeRoute();
      this.changeTab();
    }
  }

  /**
   * Tab 栏切换函数 - 根据 Hash 中字段 hideTab 判断是否隐藏导航栏
   */
  changeTab() {
    const { location } = this.props;
    let hash = this.queryString.parse(location.hash);
    if ('hideTab' in hash && hash['hideTab'] !== 'false') {
      this.setState(
        {
          tabHidden: true,
        }
      );
    } else {
      this.setState(
        {
          tabHidden: false,
        }
      );
    }
  }

  /**
   * 路由切换检测 - 根据当前路由进行 Tab 切换
   */
  changeRoute() {
    let location = this.props.location.pathname;
    let locationUrls = location.substring(1, location.length).split('/');
    // console.log('当前路径:', location, '\n路径分割:', locationUrls);
    // 二级路径分割，根据路径进行 Tab 切换
    switch (locationUrls[1]) {
      case 'home':
        this.setState(
          {
            selectedTab: 'homeTab',
          }
        );
        break;
      case 'order':
        this.setState(
          {
            selectedTab: 'orderTab',
          }
        );
        break;
      case 'my':
        this.setState(
          {
            selectedTab: 'myTab',
          }
        );
        break;
      case 'cart':
        this.setState(
          {
            selectedTab: 'cartTab',
          }
        );
        break;
      default: // 未选中 Tab
        this.setState(
          {
            selectedTab: null,
          }
        );
        break;
    }
  }

  render() {
    const { match, location, history } = this.props;
    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
        hidden={this.state.tabHidden}
      >
        <TabBar.Item
          title="首页"
          key="home"
          icon={<FontAwesomeIcon icon={faHome} size="lg" />}
          selectedIcon={<FontAwesomeIcon icon={faHome} size="lg" />}
          selected={this.state.selectedTab === 'homeTab'}
          onPress={() => {
            // 进行路由跳转
            history.push('/tab/home');

            // 记录当前的Tab页
            this.setState({
              selectedTab: 'homeTab',
            });
          }}
        >
          <Route path="/tab/home" component={Home} />
        </TabBar.Item>
        <TabBar.Item
          icon={<FontAwesomeIcon icon={faShoppingCart} size="lg" />}
          selectedIcon={<FontAwesomeIcon icon={faShoppingCart} size="lg" />}
          title="购物车"
          key="cart"
          selected={this.state.selectedTab === 'cartTab'}
          onPress={() => {
            // 进行路由跳转
            history.push('/tab/cart');

            // 存储状态
            this.setState(
              {
                selectedTab: 'cartTab',
              }
            );
          }}
        >
          <Route path="/tab/cart" component={Cart} />
        </TabBar.Item>
        <TabBar.Item
          icon={<FontAwesomeIcon icon={faClipboardList} size="lg" />}
          selectedIcon={<FontAwesomeIcon icon={faClipboardList} size="lg" />}
          title="订单"
          key="order"
          selected={this.state.selectedTab === 'orderTab'}
          onPress={() => {
            // 进行路由跳转
            history.push('/tab/order');

            // 存储状态
            this.setState({
              selectedTab: 'orderTab',
            });
          }}
        >
          <Route path="/tab/order" component={Order} />
        </TabBar.Item>
        <TabBar.Item
          icon={<FontAwesomeIcon icon={faUser} size="lg" />}
          selectedIcon={<FontAwesomeIcon icon={faUser} size="lg" />}
          title="我的"
          key="my"
          selected={this.state.selectedTab === 'myTab'}
          onPress={() => {
            history.push('/tab/my');

            this.setState({
              selectedTab: 'myTab',
            });
          }}
        >
          <Route path="/tab/my" component={My} />
        </TabBar.Item>
      </TabBar>
    );
  }
}

TabLayout = withRouter(TabLayout);
