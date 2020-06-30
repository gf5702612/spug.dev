---
id: example-java
title: Java项目配置
---

## 概览
以 `若依管理系统` [https://gitee.com/y_project/RuoYi](https://gitee.com/y_project/RuoYi) 作为例子，最终大概是这样子的。
> 以下基于 spug v2.3.4 版本，如果低于 v2.3.4 可以参考 [版本升级文档](/docs/update-version/) 进行升级，例子仅作为演示，一般情况下你都需要结合自己的项目情况调整配置。

![about](/images/example-java-1.png)


## 安装 jdk / maven
如果已安装可跳过该步骤，这里以安装 `jdk-8u251` 和 `maven-3.6.3` 为例，如果你使用 Docker 部署的 `Spug`，可参考以下步骤进行安装
> 以下仅适用于 `2.3.4` 及以后的镜像（基于 `Centos`）启动的容器（这里的 `2.3.4` 并不是 `Spug` 的版本号，请在 [hub.docker.com](https://hub.docker.com/r/openspug/spug/tags) 查询镜像版本），
> 之前的版本的镜像（基于 `Alpine`）可参考 [Java项目配置](/docs/example-java-old/)。

> 因 Oracle JDK 下载需要登录账户请自行[下载](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)，这里直接使用下载完成的 `jdk-8u251-linux-x64.tar.gz` 文件。
```shell script
# 自行至 https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html 下载jdk
# 把已下载的压缩包拷贝进容器
$ docker cp jdk-8u251-linux-x64.tar.gz spug:/
$ docker exec -it spug bash
$ tar xf jdk-8u251-linux-x64.tar.gz -C /opt

# 安装maven
$ curl -o apache-maven-3.6.3-bin.tar.gz http://apache.mirrors.pair.com/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz
$ tar xf apache-maven-3.6.3-bin.tar.gz -C /opt/
$ echo -e 'export JAVA_HOME=/opt/jdk1.8.0_251\nexport PATH=$PATH:$JAVA_HOME/bin:/opt/apache-maven-3.6.3/bin' > /etc/profile.d/java.sh

# [可选]配置阿里云镜像加速下载，在159-164行（<mirrors>标签内）添加以下内容
$ vi /opt/apache-maven-3.6.3/conf/settings.xml

    159     <mirror>
    160       <id>aliyunmaven</id>
    161       <mirrorOf>*</mirrorOf>
    162       <name>阿里云公共仓库</name>
    163       <url>https://maven.aliyun.com/repository/public</url>
    164     </mirror>

# 退出并重启容器
$ exit
$ docker restart spug
```

## 文件过滤
只需要发布编译过的 jar 包，所以这里选择了 `包含` 规则。
```shell script
ruoyi-admin.jar
```

## 自定义变量
该例子中并不需要特殊的全局变量，如果你需要的话可以在这里定义，然后在下边的钩子中类似 `$SPUG_DEPLOY_ID` 那样去引用。

## 代码检出前
该例子中也不需要执行。

## 代码检出后
在这里进行项目的依赖包安装和编译工作，该钩子中当前目录即为按发布申请中选择 `Git 分支/版本` 检出后的代码目录。
```shell script
# 执行maven编译
$ mvn clean package -Dmaven.test.skip=true
$ cp ruoyi-admin/target/ruoyi-admin.jar .
```
这里拷贝 `ruoyi-admin.jar` 至项目根目录，因为咱们文件过滤规则指定的就是相对于项目根目录。

## 应用发布前
发布前停止现有的服务，这里使用使用了 `set +e`, 默认 `Spug` 执行任何一个命令如果返回的退出状态码不为 `0` 则终止发布，这里使用 `kill` 杀进程
时可能之前由于各种原因进程已经不存在了，那么执行以下命令时可能会返回非 `0` 的退出状态码，所以使用 `set +e` 来避免该问题。
```shell script
# 停止服务
$ set +e
$ ps -ef | grep ruoyi-admin | grep -v grep | awk '{print $2}' | xargs kill -9
```

## 应用发布后
在这里启动服务。
```shell script
# 添加jdk至PATH变量
PATH=$PATH:/usr/local/jdk1.8.0_231/bin
nohup java -jar ruoyi-admin.jar &> run.log &
```
