---
id: example-java
title: Java项目配置
---

## 概览
> 以下基于 spug v2.3.2 版本，例子仅作为演示，一般你都需要结合自己的项目情况调整配置。


## 安装 jdk / maven
如果已安装可跳过该步骤，这里以安装 `jdk-8u251` 和 `maven-3.6.3` 为例，如果你使用 Docker 部署的 `Spug`，可参考以下步骤进行安装
> 因 Oracle JDK 下载需要登录账户请自行[下载](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)，这里直接使用下载完成的 `jdk-8u251-linux-x64.tar.gz` 文件。
```shell script
# 自行至 https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html 下载jdk
# 把已下载的压缩包拷贝进容器
$ docker cp jdk-8u251-linux-x64.tar.gz spug:/
$ docker exec -it spug sh
$ tar xf jdk-8u251-linux-x64.tar.gz -C /opt

# 安装maven
$ wget http://apache.spinellicreations.com/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz
$ tar xf apache-maven-3.6.3-bin.tar.gz -C /opt/
$ echo -e 'export JAVA_HOME=/opt/jdk1.8.0_251\nexport PATH=$PATH:$JAVA_HOME/bin:/opt/apache-maven-3.6.3/bin' > /etc/profile.d/java.sh

# 安装glibc
$ wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub
$ wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-2.31-r0.apk
$ apk add glibc-2.31-r0.apk

# 退出容器并重启容器
$ exit
$ docker restart spug
```
> 注意：如果你使用的镜像版本低于 2.3.4（https://hub.docker.com/r/openspug/spug/tags 可在这里查看版本信息），则还需要在容器内执行以下操作
> ```shell script
> $ vi /entrypoint.sh
> 
> #!/bin/sh
> #
> # 新增内容开始 -----------
> if [ -e /etc/profile ]; then
>     source /etc/profile
> fi
> # ---------- 新增内容结束
> 
> if [ ! -d /run/nginx ]; then
> ...
> ```

## 文件过滤
未完待续

## 自定义变量
未完待续

## 代码检出前
未完待续

## 代码检出后
未完待续

## 应用发布前
未完待续

## 应用发布后
未完待续

