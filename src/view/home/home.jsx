import React from 'react';
import { Carousel, WingBlank, Flex, List, WhiteSpace, Card } from 'antd-mobile';
import './home.css';

const Item = List.Item;

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ['1', '2', '3'],
      imgHeight: 176,
    }
  }



  componentDidMount() {
    // simulate img loading
    setTimeout(() => {
      this.setState({
        data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
      });
    }, 100);
  }

  render() {
    return (
      <div className="home-layout">
        {/* 跑马灯轮播图 */}
        <div className="home-carousel">
          <Carousel
            autoplay={false}
            infinite
            beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
            afterChange={index => console.log('slide to', index)}
          >
            {this.state.data.map(val => (
              <a
                key={val}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
              >
                <img
                  src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                    this.setState({ imgHeight: 'auto' });
                  }}
                />
              </a>
            ))}
          </Carousel>
        </div>
        <WhiteSpace size="md" />
        {/* 主页菜单 */}
        <div className="home-menu">
          <WingBlank size="md">
            <Flex justify="between">
              <Flex.Item>
                <div className="menu-container">
                  <div className="menu-item">

                  </div>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className="menu-container">
                  <div className="menu-item">

                  </div>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className="menu-container">
                  <div className="menu-item">

                  </div>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className="menu-container">
                  <div className="menu-item">

                  </div>
                </div>
              </Flex.Item>
            </Flex>
          </WingBlank>
        </div>
        <WhiteSpace size="md" />
        {/* 店铺列表 */}

        <Card full>
          <Card.Header title="好店推荐" />
          <Card.Body>
            <List>
              <Item>

              </Item>
            </List>
          </Card.Body>

        </Card>

      </div>

    );
  }
}
