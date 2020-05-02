---
id: deploy-product-script
title: 生产环境一键部署
---

## 操作系统
> 一键安装脚本在Centos7/8和Ubuntu 18.04验证通过，其他版本暂未验证。

## 安装命令
```shell script
$ curl https://spug.dev/installer/latest/install.sh | bash
```

## 默认设置
```
# 默认代码安装路径：
/data/spug

# 默认创建的数据库账号
用户：spug   
密码：spug.dev


# 默认创建的系统管理员
账户：admin  
密码：spug.dev


```