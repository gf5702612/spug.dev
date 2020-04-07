---
id: update-version
title: 版本升级
---
## 更新到2.2.x 版本
```
# 更新代码
$ cd spug && git pull && checkout v2.2.0

# 更新表结构
$ cd spug_api
$ source venv/bin/activate
$ python manage.py initdb
```

