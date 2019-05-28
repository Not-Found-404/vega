import React from 'react';
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

export class ShopDetail extends React.Component{

  constructor(props){
    super(props);

    // 初始化获取店铺编号
    const {location,match,history} = this.props;
    console.log('location:', location, '\nmatch:', match, '\nhistory:', history);
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

  componentDidMount(){

  }

  render(){
    // 存在 shopId 加载店铺数据
    if( this.state.shopId){
      return (
        <div>
          <h1>shopDetail Component: {this.state.shopId}</h1>
        </div>
      );
      // 不存在 shopId，不加载数据
    } else {
      return null;
    }

  }

}

ShopDetail = withRouter(ShopDetail);
