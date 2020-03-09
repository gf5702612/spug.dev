---
id: update-version
title: 版本升级
---
## 更新到2.2.0 版本
```
1、更新代码

shell> cd spug && git pull

2、更新表结构
shell> cd spug_api && python manage.py initdb

3、进入数据库，更新数据库默认值
mysql> update `spug`.`users` set type='default';
```

