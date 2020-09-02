/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;


function Sponsorship(props) {
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h2>基于 Spug 定制开发</h2>
            <p>我们提供基于 Spug 的有偿定制开发服务，可以根据用户的使用场景进行针对性的定制化开发。</p>
          </header>
        </div>
        <div className="post">
          <header >
            <h3>一次性赞助</h3>
          </header>
          <div className="sponsorshipOnetime">
            <div className="sponsorshipOnetimeQrcode">微信
              <img src='http://image.qbangmang.com/spug-wx-pay.png' alt="微信"></img>
            </div>
            <div className="sponsorshipOnetimeQrcode">支付宝
              <img src='http://image.qbangmang.com/spug-ali-pay.png' alt="支付宝"></img>
            </div>
         </div>
      </div>
        <div className="post">
          <header className="postHeader">
            <h3>周期性赞助</h3>
          </header>
          <p>周期性赞助可以获得额外的回报，比如你的名字会出现在 Spug 的 GitHub 仓库中，再比如你的公司 logo 会出现在我们的官网上。</p>
        </div>
      </Container>
    </div>
  );
}

module.exports = Sponsorship;
