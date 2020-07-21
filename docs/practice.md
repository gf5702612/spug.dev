---
id: practice
title: 实践指南
---

### 发布过程中不同主机执行不同操作
假设一个应用需要发布到不同的三台主机上，但发布需要在主机上执行一些比如更新数据库等一次性且不能重复执行的操作，这时候可以考虑使用 `Spug` 的全局变量
`SPUG_HOST_ID` 或 `SPUG_HOST_NAME` 来指定只在某个主机上执行这些操作，例如：
```shell script
if [ "$SPUG_HOST_NAME" = "192.168.10.100" ];then
    echo "exec sql"
fi
```

### 默认PATH环境变量导致命令找不到问题
默认的 `PATH` 变量可能并不完整，这是因为 `Spug` 执行命令时并不是一个登录交互 `SHELL`，如果出现一些命令找不到等报错情况可以使用类似如下写法来解
决这个问题（注意以下写法并不会跨越不同的任务钩子，例如执行发布前执行的操作并不会影响发布执行后）：
```shell script
# 添加jdk至PATH变量
PATH=$PATH:/usr/local/jdk1.8.0_231/bin
java -jar xxx.jar
```

