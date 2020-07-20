---
id: update-version
title: 版本升级
---
## Docker安装，版本更新
```
# 默认更新到最新版本
# spug 是容器名称，也可以替换为自己的容器ID

$ docker exec -i spug python3 /data/spug/spug_api/manage.py update 

# 更新完成后重启容器
$ docker restart spug
```

## 手动安装，版本更新
```
# 默认更新到最新版本

$ cd spug_api
$ source venv/bin/activate
$ python manage.py update

```

> 注意：如果你现在部署的 `v2.2.x` 的版本（如果你现在已经是 `v2.3.x` 则忽略下边的内容），因 `update` 自动升级程序的缺陷，通过上述方法自动升级至 `v2.3.0` 版本后，会出现 `Unknow column ...` 等报错信息，
>你可以通过如下操作来修复这个错误：
> ```shell script
> $ cd spug/spug_api
> $ source venv/bin/activate
> $ python manage.py makemigrations
> $ python manage.py migrate
> 
> # 最后请重启服务
> $ systemctl restart supervisord
> ```

