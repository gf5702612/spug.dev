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

## Docker安装，版本更新
```
# 默认更新到最新版本
# $CONTAINERID是你的容器ID

# docker exec $CONTAINERID python manage.py update 
```
