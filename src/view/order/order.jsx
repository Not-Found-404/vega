import React from 'react';
import './order.css';
import {NavBar, Card, Icon, Toast} from 'antd-mobile';
import {OrderWebService} from "../../service/order/order.web.service";
import {TimeUtil} from "../../util/time.util";

export class Order extends React.Component {
  orderWebService = new OrderWebService();

  constructor(props) {
    super(props);
  }

  state = {
    orderList: []
  };

  componentDidMount() {
    this.setData();
  }

  setData = () => {
    this.orderWebService.webOrderList({
      params: {},
      success: (data) => {
        this.setState({
          orderList: data.data
        })
      }
    })
  };

  getOrderList = () => {
    const orderView = [];
    let orderList = this.state.orderList;
    for (let i = 0; i < orderList.length; i++) {
      let orderInfo = orderList[i];
      orderView.push(
        <Card style={{margin: "5px", marginBottom: "10px"}}
              onClick={() => {
                this.props.history.push('/route/orderDetail/' + orderInfo.orderId);
              }}
        >
          <Card.Header
            title={(<span style={{marginLeft: "5px"}}>{orderInfo.shopName}</span>)}
            thumb={orderInfo.shopImage}
            thumbStyle={{width: "50px", height: "50px"}}
            extra={(<span style={{fontSize: "14px"}}>
              {this.getOrderStatus(orderInfo)}
            </span>)}
          />
          <Card.Body>
            <span>{orderInfo.description}</span>
            <span style={{float: "right"}}>{"￥" + orderInfo.paidAmount}</span>
            <br/>
            <br/>
            <span>{TimeUtil.formatTime(orderInfo.createdAt, false)}</span>
            {this.getOrderOp(orderInfo)}
          </Card.Body>
        </Card>
      );
    }
    return orderView;
  };

  getOrderStatus = (orderInfo) => {
    return orderInfo.enableStatus === 0 ?
      "等待商家接单" : orderInfo.enableStatus === -1 ?
        "订单被拒绝" : orderInfo.payStatus !== 1 ?
          "待支付" : orderInfo.receiveStatus === 1 ?
            "订单已完成" : orderInfo.receiveStatus === -1 ?
              "商家处理中" : "待评价";
  };

  getOrderOp = (orderInfo) => {
    if (orderInfo.enableStatus === -1) {
      return;
    }
    if (orderInfo.enableStatus === 0) {
      return (
        <a className={"order-op-button"} style={{float: "right"}}
           onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             this.cancelOrder(orderInfo.orderId);
           }}>取消订单</a>
      )
    }
    if (orderInfo.payStatus === -1) {
      return (
        <a className={"order-op-button"} style={{float: "right"}}
           onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             this.payOrder(orderInfo.orderId, orderInfo.paidAmount);
           }}
        >去支付</a>
      )
    }
    if (orderInfo.receiveStatus === 0) {
      return (
        <a className={"order-op-button"} style={{float: "right"}}
           onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             this.props.history.push("/route/commentCreate/" + orderInfo.orderId);
           }}
        >评价订单</a>
      )
    }
  };


  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => this.props.history.push('/tab/home')}
          style={{marginBottom: "15px"}}
        >我的订单</NavBar>
        {this.getOrderList()}
      </div>
    );
  }

  payOrder = (orderId, paidAmount) => {
    this.orderWebService.payOrder({
      params: {
        orderId: orderId,
        paidAmount: paidAmount
      },
      success: (data) => {
        Toast.info("支付成功");
        this.setData();
      }
    })
  };

  cancelOrder = (orderId) => {
    this.orderWebService.cancel({
      params: {
        orderId: orderId
      },
      success: (data) => {
        Toast.info("取消成功");
        this.setData();
      }
    });
  }
}
