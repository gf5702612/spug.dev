---
id: example-node
title: Node项目配置
---

## 概览
以 `Spug` 的前端 `spug_web` 作为例子来说下前端项目的配置，最终大概是这样子的。
> 以下基于 spug v2.3.2 版本，例子仅作为演示，一般你都需要结合自己的项目情况调整配置。

![about](/images/example-node-1.jpg)

## 安装 node(npm)
如果已安装可跳过该步骤，这里以目前的最新版 `v12.18.1` 为例，如果你使用 Docker 部署的 `Spug`，可参考以下步骤进行安装
```shell script
docker exec -it spug sh
wget https://unofficial-builds.nodejs.org/download/release/v12.18.1/node-v12.18.1-linux-x64-musl.tar.gz
tar xf node-v12.18.1-linux-x64-musl.tar.gz -C /opt
echo 'export PATH=$PATH:/opt/node-v12.18.1-linux-x64-musl/bin' > /etc/profile.d/node.sh

# 退出容器并重启容器
exit
docker restart spug
```

## 文件过滤
前端项目发布的时候只需要编译后的内容就可以，这里选择了 `包含` 条件，内容为 `spug_web/build`，这样最终发布到目标主机上的代码仅包含
`spug_web/build`，并不会把 `spug_api` 及 `spug_web` 中的前端源代码发布出去。

## 自定义变量
该例子中并不需要特殊的全局变量，如果你需要的话可以在这里定义，然后在下边的钩子中类似 `$SPUG_DEPLOY_ID` 那样去引用。

## 代码检出前
作为前端项目免不了要处理项目依赖包的问题，依赖安装一般在 `package.json` 所在的目录（在本示例中即`spug_web`）中执行 `npm install`
或 `yarn` 来安装。这里使用了 [全局环境变量](https://spug.dev/docs/deploy-config/#%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F) 中的
`SPUG_DEPLOY_ID` 来切换到源码目录执行依赖的安装。
```shell script
cd /data/spug/spug_api/repos/$SPUG_DEPLOY_ID/spug_web
yarn
```

## 代码检出后
在这里进行项目的编译工作，该钩子中当前目录即为按发布申请中选择 `Git 分支/版本` 检出后的代码目录，我们需要先把上一步安装依赖生产的 `node_modules`
目录链接到当前目录（这样可以避免每次都完整的执行`npm install`来重复安装依赖包），然后执行 `yarn build` 来进行项目编译。
```shell script
cd spug_web
ln -s ../../$SPUG_DEPLOY_ID/spug_web/node_modules ./node_modules
yarn build
```
编译后也就生成了我们在 **文件过滤** 中设置的 `spug_web/build` 目录。

## 应用发布前
由于我们设置的文件过滤规则 `spug_web/build`，所以传输到目标主机上文件结构也是 `spug_web/build/xx`，我们需要调整下目录结构，
让 `spug_web/build` 目录下内容放到项目的根目录中。
```shell script
mv spug_web/build/* .
rm -rf spug_web
```

## 应用发布后
前端项目编译后就是纯静态的 `html`、`js` 和一些静态文件，这里一般就不需要额外的处理了。

