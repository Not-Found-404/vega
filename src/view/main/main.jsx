import React from 'react';
import { TabBar } from 'antd-mobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 导入 Fontawesome 图标库
import { faUser, faClipboardList, faHome } from '@fortawesome/free-solid-svg-icons';      // 导入 Fontawesome 图标库
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './main.css';

export class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'homeTab',
    };
  }


  render() {
    return (
      <Router>
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
                this.setState({
                  selectedTab: 'homeTab',
                });
              }}
            >

            </TabBar.Item>
            <TabBar.Item
              icon={<FontAwesomeIcon icon={faClipboardList} size="lg" />}
              selectedIcon={<FontAwesomeIcon icon={faClipboardList} size="lg" />}
              title="订单"
              key="order"
              selected={this.state.selectedTab === 'orderTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'orderTab',
                });
              }}
            >

            </TabBar.Item>
            <TabBar.Item
              icon={<FontAwesomeIcon icon={faUser} size="lg" />}
              selectedIcon={<FontAwesomeIcon icon={faUser} size="lg" />}
              title="我的"
              key="my"
              selected={this.state.selectedTab === 'myTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'myTab',
                });
              }}
            >

            </TabBar.Item>
          </TabBar>
        </div>
      </Router>
    );
  }
}


