import React from 'react';
import {NavBar, Card, Icon, Flex} from 'antd-mobile';
import {OrderWebService} from "../../service/order/order.web.service";
import {TimeUtil} from "../../util/time.util";

export class OrderDetail extends React.Component {
  orderWebService = new OrderWebService();

  constructor(props) {
    super(props);
  }

  state = {
    orderDetail: null
  };

  componentDidMount() {
    this.setData();
  }

  setData = () => {
    let orderId = this.props.match.params.orderId;
    this.orderWebService.getDetail({
      params: {
        orderId: orderId
      },
      success: (data) => {
        this.setState({
          orderDetail: data,
          orderId: orderId
        })
      }
    })
  };


  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => this.props.history.push('/tab/order')}
          style={{marginBottom: "15px"}}
        >订单详情</NavBar>
        {this.getOrderDetail()}
      </div>
    );
  }

  getOrderDetail = () => {
    let orderDetail = this.state.orderDetail;
    if (orderDetail !== null) {
      let orderInfo = orderDetail.orderThinResponse;
      let itemList = orderDetail.orderLineThinResponseList;
      return (
        <div>
          <h1 style={{marginLeft: "10px"}}>{this.getOrderStatus(orderInfo)}</h1>
          <Card style={{margin: "5px"}}>
            <Card.Body>
              <h3>{this.getDescriptionInfo(orderInfo)}</h3>
            </Card.Body>
          </Card>
          {this.getOrderLineListView(orderInfo, itemList)}
          {this.getOrderInfo(orderInfo)}
          {this.getShopInfo(orderInfo)}
        </div>
      );
    }
  };

  getShopInfo = (orderInfo) => {
    return (
      <Card style={{margin: "5px"}}>
        <Card.Header
          title={"店铺信息"}
        />
        <Card.Body>
          <div style={{marginBottom: "15px"}}>
            <span style={{float: "left"}}>店铺</span>
            <span style={{float: "right"}}>{orderInfo.shopName}</span>
          </div>
          <br/>
          <div style={{marginBottom: "15px"}}>
            <span style={{float: "left"}}>卖家留言</span>
            <span style={{float: "right"}}>{orderInfo.shopNotes}</span>
          </div>
        </Card.Body>
      </Card>
    )
  };

  getOrderInfo = (orderInfo) => {
    return (
      <Card style={{margin: "5px"}}>
        <Card.Header
          title={"订单信息"}
        />
        <Card.Body>
          <div style={{marginBottom: "15px"}}>
            <span style={{float: "left"}}>订单号</span>
            <span style={{float: "right"}}>{orderInfo.orderId}</span>
          </div>
          <br/>
          <div style={{marginBottom: "15px"}}>
            <span style={{float: "left"}}>下单时间</span>
            <span style={{float: "right"}}>{TimeUtil.formatTime(orderInfo.createdAt, true)}</span>
          </div>
          <br/>
          <div style={{marginBottom: "15px"}}>
            <span style={{float: "left"}}>备注</span>
            <span style={{float: "right"}}>{orderInfo.buyerNotes}</span>
          </div>
        </Card.Body>
      </Card>
    )
  };

  getItemList = (itemList) => {
    console.log(itemList);
    if (itemList !== null && itemList.length > 0) {
      const itemView = [];
      for (let i = 0; i < itemList.length; i++) {
        let itemInfo = itemList[i];
        itemView.push(
          <div style={{marginBottom: "30px"}}>
            <Flex>
              <Flex.Item>
                <img src={itemInfo.itemImage} style={{width: "50px", height: "50px"}} alt=""/>
              </Flex.Item>
              <Flex.Item
              >
                <div style={{marginBottom: "2px"}}>{itemInfo.itemName}</div>
                <br/>
                <div style={{fontSize: "10px"}}>{this.getItemAttribute(itemInfo)}</div>
              </Flex.Item>
              <Flex.Item
                style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}
              >{"x" + itemInfo.quantity}</Flex.Item>
              <Flex.Item
                style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}
              >{"￥" + itemInfo.paidAmount}</Flex.Item>
            </Flex>
          </div>
        );
      }
      return itemView;
    }
  };

  getOrderStatus = (orderInfo) => {
    return orderInfo.enableStatus === 0 ?
      "等待商家接单" : orderInfo.enableStatus === -1 ?
        "订单被拒绝" : orderInfo.payStatus !== 1 ?
          "待支付" : orderInfo.receiveStatus === 1 ?
            "订单已完成" : orderInfo.receiveStatus === -1 ?
              "商家处理中" : "待评价";
  };

  getItemAttribute = (itemInfo) => {
    let attrList = itemInfo.itemAttribute;
    let attrStr = "";
    if (attrList !== null) {
      for (let attr in attrList) {
        attrStr += (" " + attrList[attr]);
      }
    }
    return attrStr;
  };

  getOrderLineListView(orderInfo, itemList) {
    return (
      <Card style={{margin: "5px"}}>
        <Card.Header
          onClick={() => {
            this.props.history.push('/route/shopDetail?shopId=' + orderInfo.shopId);
          }}
          title={(<span style={{marginLeft: "5px"}}>{orderInfo.shopName}</span>)}
          thumb={(<Icon type="right"/>)}
        />
        <Card.Body>
          {this.getItemList(itemList)}
        </Card.Body>
      </Card>
    );
  }

  getDescriptionInfo = (orderInfo) => {
    return "感谢您对本平台的信任，期待下次光临";
  }
}
