---
id: update-version
title: 版本升级
---
## 命令安装，版本更新
```
# 默认更新到最新版本

$ cd spug_api
$ source venv/bin/activate
$ python manage.py update

```

> 注意：如果你现在部署的 `v2.2.x` 的版本（如果你现在已经是 `v2.3.x` 则忽略下边的内容），因 `update` 自动升级程序的缺陷，通过上述方法自动升级至 `v2.3.0` 版本后，会出现 `Unknow column ...` 等报错信息，
>我们将在下个版本修复该问题，你可以通过如下操作来修复这个错误：
> ```shell script
> $ cd spug_api
> $ source venv/bin/activate
> $ python manage.py makemigrations
> $ python manage.py migrate
> 
> # 最后请重启服务
> $ systemctl restart supervisord
> ```

## Docker安装，版本更新
```
# 默认更新到最新版本
# $CONTAINERID是你的容器ID

# docker exec -i $CONTAINERID /data/spug/spug_api/manage.py update 
# 更新完成后重启容器
# docker restart $CONTAINERID
```

> 注意：Docker 方式部署的因镜像问题无法正常更新到 `v2.3.0`，请直接使用新版镜像并参考新版的 [docker安装](/docs/install-docker) 文档，对此我们非常抱歉。