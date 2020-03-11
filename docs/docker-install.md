---
id: docker-install
title: Docker安装
---

> 此安装文档适合快速体验spug功能，如果你是在生产环境部署，请参考 [生产环境部署](/docs/deploy-product) 文档。

## 依赖环境

- Docker
- 现代浏览器

## 安装步骤
以下安装步骤使用 `Centos7.x` 操作系统系统。

### 1. 安装docker

```shell script
yum install docker
```

### 2. 拉取镜像
```shell script
docker pull reg.qiniu.com/openspug/spug
```

### 3. 启动
Docker镜像内部使用的 `Sqlite` 数据库。
```shell script
docker run -d -p 80:80 reg.qiniu.com/openspug/spug
```

### 4. 访问测试
在浏览器中输入 `http://localhost:80` 访问。  
```
用户名： admin  
密码： spug.dev
```
