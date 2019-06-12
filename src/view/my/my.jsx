import React from 'react';
import { UserWebService } from '../../service/user/user.web.service';
import { Button } from 'antd-mobile';
import { faUser, faUserCircle, faPhone, faEnvelope, faCode, faGem, faGrin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import './my.css';

export class My extends React.Component {
  // 注入服务
  userWebService = new UserWebService();

  constructor(props) {
    super(props);

    this.state = {
      userInfoData: null,
    };

    // 绑定 this
    this.initUserInfo = this.initUserInfo.bind(this);
    this.userLogout = this.userLogout.bind(this);
    this.gotoRouteLocation = this.gotoRouteLocation.bind(this);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    // 初始化获取用户数据
    this.initUserInfo();
  }

  /**
   * 初始化用户数据
   */
  initUserInfo() {
    this.userWebService.getUserInfo(
      {
        // 传输参数
        params: null,
        // 成功回调函数
        success: (res) => {
          console.log(res);
          this.setState(
            {
              userInfoData: res,
            }
          );
        },
      }
    );
  }

  /**
  * 路由跳转函数
  * @param {string} location - 路由地址
  */
  gotoRouteLocation(location) {
    let history = this.props.history;
    history.push(location);
  }

  /**
   * 用户登出函数
   */
  userLogout() {
    this.userWebService.logout({
      // 传输参数
      params: null,
      // 成功回调函数
      success: (res) => {
        this.gotoRouteLocation(`http://login.qtu404.com?redirectTo=${document.location}`);
      },
    });
  }

  render() {

    /**
     * 渲染账户类型
     * @param {any} accountType - 账户类型
     */
    const renderAccountType = (accountType) => {
      switch (accountType) {
        case 1:
          return ('消费者');
        case 2:
          return ('商家');
        case 3:
          return ('管理员');
        default:
          return null;
      }
    }

    /**
    * 渲染账户状态
    * @param {any} accountType - 账户类型
    */
    const renderAccountStatus = (accountStatus) => {
      switch (accountStatus) {
        case 1:
          return ('启用');
        case 2:
          return ('冻结');
        default:
          return null;
      }
    }

    return (
      <div className="myInfo-layout">
        <div className="myInfo-thumb">
          <div style={{ overflow: 'hidden' }}>
            <div
              className="myInfo-thumb__background"
              style={{
                backgroundImage: `url(${this.state.userInfoData ? this.state.userInfoData.avatar ? this.state.userInfoData.avatar : null : null})`,
              }}
            >
            </div>
          </div>
          {/** 用户信息显示区域 */}
          <div className="myInfo-brief">
            {/** 用户头像 */}
            <div className="myInfo-thumb__img-container">
              <img
                className="myInfo-thumb__img"
                alt="avatar" src={this.state.userInfoData ? this.state.userInfoData.avatar ? this.state.userInfoData.avatar : null : null}
              />
            </div>
            <div className="myInfo-detail">
              <div className="myInfo-name__nickName">
                {this.state.userInfoData ? this.state.userInfoData.nickname ? this.state.userInfoData.nickname : null : null}
              </div>

              {/** 个人信息内容项 */}
              <div className="myInfo-item">
                <div className="myInfo-item__prefix">
                  <div className="myInfo-item__prefix-icon">
                    <FontAwesomeIcon icon={faCode} size="sm" />
                  </div>
                  <div className="myInfo-item__prefix-title">
                    用户编号：
                  </div>
                </div>
                <div className="myInfo-item__content">
                  {this.state.userInfoData ? this.state.userInfoData.userId ? this.state.userInfoData.userId : null : null}
                </div>
              </div>

              {/** 个人信息内容项 */}
              <div className="myInfo-item">
                <div className="myInfo-item__prefix">
                  <div className="myInfo-item__prefix-icon">
                    <FontAwesomeIcon icon={faUser} size="sm" />
                  </div>
                  <div className="myInfo-item__prefix-title">
                    用户名：
                  </div>
                </div>
                <div className="myInfo-item__content">
                  {this.state.userInfoData ? this.state.userInfoData.username ? this.state.userInfoData.username : null : null}
                </div>
              </div>

              {/** 个人信息内容项 */}
              <div className="myInfo-item">
                <div className="myInfo-item__prefix">
                  <div className="myInfo-item__prefix-icon">
                    <FontAwesomeIcon icon={faUserCircle} size="sm" />
                  </div>
                  <div className="myInfo-item__prefix-title">
                    姓名：
                  </div>
                </div>
                <div className="myInfo-item__content">
                  {this.state.userInfoData ? this.state.userInfoData.name ? this.state.userInfoData.name : null : null}
                </div>
              </div>

              {/** 个人信息内容项 */}
              <div className="myInfo-item">
                <div className="myInfo-item__prefix">
                  <div className="myInfo-item__prefix-icon">
                    <FontAwesomeIcon icon={faPhone} size="sm" />
                  </div>
                  <div className="myInfo-item__prefix-title">
                    电话：
                  </div>
                </div>
                <div className="myInfo-item__content">
                  {this.state.userInfoData ? this.state.userInfoData.mobile ? this.state.userInfoData.mobile : null : null}
                </div>
              </div>

              {/** 个人信息内容项 */}
              <div className="myInfo-item">
                <div className="myInfo-item__prefix">
                  <div className="myInfo-item__prefix-icon">
                    <FontAwesomeIcon icon={faEnvelope} size="sm" />
                  </div>
                  <div className="myInfo-item__prefix-title">
                    邮箱：
                  </div>
                </div>
                <div className="myInfo-item__content">
                  {this.state.userInfoData ? this.state.userInfoData.email ? this.state.userInfoData.email : null : null}
                </div>
              </div>

              {/** 个人信息内容项 */}
              <div className="myInfo-item">
                <div className="myInfo-item__prefix">
                  <div className="myInfo-item__prefix-icon">
                    <FontAwesomeIcon icon={faGem} size="sm" />
                  </div>
                  <div className="myInfo-item__prefix-title">
                    账户类型：
                  </div>
                </div>
                <div className="myInfo-item__content">
                  {renderAccountType(this.state.userInfoData ? this.state.userInfoData.type ? this.state.userInfoData.type : null : null)}
                </div>
              </div>

              {/** 个人信息内容项 */}
              <div className="myInfo-item">
                <div className="myInfo-item__prefix">
                  <div className="myInfo-item__prefix-icon">
                    <FontAwesomeIcon icon={faGrin} size="sm" />
                  </div>
                  <div className="myInfo-item__prefix-title">
                    账户状态：
                  </div>
                </div>
                <div className="myInfo-item__content">
                  {renderAccountStatus(this.state.userInfoData ? this.state.userInfoData.status ? this.state.userInfoData.status : null : null)}
                </div>
              </div>

            </div>

            <div className="myInfo-logout">
              <Button
                className="myInfo-logout__btn" type="primary"
                onClick={() => { this.props.history.push('/api/common/user/logout'); }}
              >
                注销
              </Button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

My = withRouter(My);
