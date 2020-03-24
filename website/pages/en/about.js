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

function About(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;


  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h2>关于Spug</h2>
          </header>
          <p>Spug：麻雀，麻雀虽小，五脏俱全。</p>
          <p>Spug是面向中小型企业的运维平台，平台虽小但功能全，灵活强大，可以满足中小企业发布部署，任务调度，批量执行，配置中心，监控报警等管理。</p>
        </div>
        <div className="post">
          <header className="postHeader">
            <h2>关注Spug公众号</h2>
          </header>
          <div className="abooutSpugQrcode">
            <img src='http://image.qbangmang.com/weixin-spug-8.jpg' alt="关注我们"></img>
          </div>
        </div>
      </Container>
    </div>
  );
}

module.exports = About;
