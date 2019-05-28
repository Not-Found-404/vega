import React from 'react';
import { TabBar } from 'antd-mobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 导入 Fontawesome 图标库
import { faUser, faClipboardList, faHome } from '@fortawesome/free-solid-svg-icons';      // 导入 Fontawesome 图标库
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Home } from "../home/home";
import { Order } from "../order/order";
import { My } from "../my/my";
import { Cart } from '../cart/cart';
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
    this.state = {
      selectedTab: 'homeTab', // 默认选中的 Tab 为首页
    };
    // 绑定 this
    this.changeRoute = this.changeRoute.bind(this);
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
    this.props.history.push('/home');
    // 登录用户
    this.userWebService.login(
      {
        params: {
          mobile: "17864293685",
          password: "1",
          type: 2
        },
        success: (data) => { }
      }
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // 判断组件是否更新
    if (this.props !== prevProps ) {
      this.changeRoute();
    }
  }

  /**
   * 路由切换检测 - 根据当前路由进行 Tab 切换
   */
  changeRoute() {
    let location = this.props.location.pathname;
    let locationUrls = location.substring(1, location.length).split('/');
    console.log('当前路径:', location, '\n路径分割:', locationUrls);
    switch (locationUrls[0]) {
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
      default:
        break;
    }
  }

  render() {
    const { match, location, history } = this.props;
    return (
      <div className="layout">
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
        >
          <TabBar.Item
            title="首页"
            key="home"
            icon={<FontAwesomeIcon icon={faHome} size="lg" />}
            selectedIcon={<FontAwesomeIcon icon={faHome} size="lg" />}
            selected={this.state.selectedTab === 'homeTab'}
            onPress={() => {
              // 进行路由跳转
              history.push('/home');

              // 记录当前的Tab页
              this.setState({
                selectedTab: 'homeTab',
              });
            }}
          >
            <Route path="/home" component={Home} />
          </TabBar.Item>
          <TabBar.Item
            icon={<FontAwesomeIcon icon={faClipboardList} size="lg" />}
            selectedIcon={<FontAwesomeIcon icon={faClipboardList} size="lg" />}
            title="购物车"
            key="cart"
            selected={this.state.selectedTab === 'cartTab'}
            onPress={() => {
              // 进行路由跳转
              history.push('/cart');

              // 存储状态
              this.setState({
                selectedTab: 'cartTab',
              });
            }}
          >
            <Route path="/cart" component={Cart} />
          </TabBar.Item>
          <TabBar.Item
            icon={<FontAwesomeIcon icon={faClipboardList} size="lg" />}
            selectedIcon={<FontAwesomeIcon icon={faClipboardList} size="lg" />}
            title="订单"
            key="order"
            selected={this.state.selectedTab === 'orderTab'}
            onPress={() => {
              // 进行路由跳转
              history.push('/order');

              // 存储状态
              this.setState({
                selectedTab: 'orderTab',
              });
            }}
          >
            <Route path="/order" component={Order} />
          </TabBar.Item>
          <TabBar.Item
            icon={<FontAwesomeIcon icon={faUser} size="lg" />}
            selectedIcon={<FontAwesomeIcon icon={faUser} size="lg" />}
            title="我的"
            key="my"
            selected={this.state.selectedTab === 'myTab'}
            onPress={() => {
              history.push('/my');

              this.setState({
                selectedTab: 'myTab',
              });
            }}
          >
            <Route path="/my" component={My} />
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

Main = withRouter(Main);
