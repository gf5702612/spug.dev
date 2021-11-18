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
          <p>Spug是面向中小型企业设计的轻量级无Agent的自动化运维平台，整合了主机管理、主机批量执行、主机在线终端、文件在线上传下载、应用发布部署、在线任务计划、配置中心、监控、报警等一系列功能。</p>
        </div>
        <div className="post">
          <header className="postHeader">
            <h2>关注Spug社区公众号</h2>
          </header>
          <div className="abooutSpugQrcode">
            <img src="https://cdn.spug.cc/img/spug-club.jpg" alt="关注我们" />
          </div>
        </div>
        <div className="post">
          <header className="postHeader">
            <h2>关注Spug推送服务号</h2>
          </header>
          <div className="abooutSpugQrcode">
            <img src="https://cdn.spug.cc/img/spug-weixin.jpeg" alt="关注我们" />
          </div>
        </div>
      </Container>
    </div>
  );
}

module.exports = About;
