import React from 'react';
import { TabBar } from 'antd-mobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 导入 Fontawesome 图标库
import { faUser, faClipboardList, faHome } from '@fortawesome/free-solid-svg-icons';      // 导入 Fontawesome 图标库
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Home } from "../home/home";
import { Order } from "../order/order";
import { My } from "../my/my";
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

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'homeTab',
    };
    // 绑定 this
    this.changeRoute = this.changeRoute.bind(this);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount(){
    this.changeRoute();
  }

  /**
   * 路由切换检测
   */
  changeRoute(){
    console.log('match:', this.props.match, 'location:', this.props.match, 'history:', this.props.match);
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
            title="主页"
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
            <Route path="/home" component={ Home } />
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
            <Route path="/order" component={ Order } />
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
          <Route path="/my" component={ My } />
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

Main =  withRouter(Main);
