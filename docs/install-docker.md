---
id: install-docker
title: Docker安装
---
## 依赖环境

- Docker
- 现代浏览器

## 安装步骤
以下安装步骤使用 `Centos7.x` 操作系统系统。

### 1. 安装docker

```shell script
$ yum install docker
```

### 2. 拉取镜像
```shell script
$ docker pull reg.qiniu.com/openspug/spug
```

### 3. 启动
Docker镜像内部使用的 `Sqlite` 数据库。
> 如果需要持久化存储代码和数据，可以添加：-v 映射容器内/data路径
```shell script
$ docker run -d -p 80:80 reg.qiniu.com/openspug/spug

# 持久化存储启动命令：
# mydata是本地磁盘路径，/data是容器内代码和数据初始化存储的路径

$ docker run -d -p 80:80 -v /mydata/:/data reg.qiniu.com/openspug/spug
```

### 4. 访问测试
在浏览器中输入 `http://localhost:80` 访问。  
```
用户名： admin  
密码： spug.dev
```
