---
id: update-version
title: 版本升级
---
## 更新到2.2 版本
```
1、更新代码

shell> cd spug && git pull

2、更新表结构

mysql> ALTER TABLE `spug`.`users` 
ADD COLUMN `type` varchar(20) NULL DEFAULT "default" AFTER `password_hash`,
DROP INDEX `username`;

mysql> update `spug`.`users` set type='default';
```

