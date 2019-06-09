import React from 'react';
import {NavBar, Card, Icon, Button, TextareaItem, Slider,ImagePicker,Toast} from 'antd-mobile';
import {OrderWebService} from "../../service/order/order.web.service";
import {TimeUtil} from "../../util/time.util";
import {CommentWebService} from "../../service/comment/comment.web.service";

export class CommentCreate extends React.Component {
  orderWebService = new OrderWebService();
  commentWebService = new CommentWebService();

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setData();
  }

  state = {
    orderDetail: null,
    orderId: null,
    context: null,
    rate: 1,
    images: {},
    files:[]
  };

  setData = () => {
    let orderId = this.props.match.params.orderId;
    this.orderWebService.getDetail({
      params: {
        orderId: orderId
      },
      success: (data) => {
        this.setState({
          orderDetail: data,
          orderId: orderId,
          rate: 5
        })
      }
    })
  };

  render() {
    let orderDetail = this.state.orderDetail;
    if (orderDetail == null) {
      return (<div>无订单信息</div>)
    }
    let orderInfo = orderDetail.orderThinResponse;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => this.props.history.push('/tab/order')}
          style={{marginBottom: "15px"}}
        >提交评价</NavBar>
        <Card style={{margin: "10px"}}>
          <Card.Header
            title={orderInfo.shopName}
            thumb={orderInfo.shopImage}
            thumbStyle={{width: "50px", height: "50px", marginRight: "15px"}}
          />
          <Card.Body>
            <h2 style={{margin: "30px"}}>{this.state.rate + "分"}</h2>
            <Slider
              style={{margin: "30px"}}
              defaultValue={5}
              min={1}
              max={5}
              onChange={(val) => {
                this.setState({
                  rate: val
                });
              }}
            />
            <br/>
            <TextareaItem
              style={{background: "#f9f9f9"}}
              rows={5}
              count={127}
              placeholder={"说说看好在哪里，其他顾客想知道"}
              onChange={(val) => {
                this.setState({
                  context: val
                })
              }}
            />
            <ImagePicker
              files={this.state.files}
              onChange={this.onChange}
              onImageClick={(index, fs) => console.log(index, fs)}
              selectable={this.state.files.length < 3}
              multiple={this.state.multiple}
           />
          </Card.Body>
        </Card>
        <Button onClick={()=>{this.createComment()}} style={{margin: "10px"}} type="primary">提交评价</Button>
      </div>
    )
  }

  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files:files,
    });
  };

  createComment = () => {
    let createParam = {
      orderId: this.state.orderId,
      context: this.state.context,
      images: this.state.images,
      rate: this.state.rate,
    };
    this.commentWebService.cteate({
      params: createParam,
      success: (data) => {
        Toast.info("评价成功");
        this.props.history.push('/tab/order');
      }
    });
  };
}
