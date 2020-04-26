---
id: apis
title: 配置中心
---

## 介绍

配置中心提供了开放的接口用于获取应用在某环境下的配置。

## 规则
应用的配置将从以下途径获取并进行组合：
- 该应用在指定环境下的 `公共` 和 `私有` 配置
- 所依赖的应用的 `公共` 配置
- 所依赖的服务的配置
- 根据指定的环境，仅读取指定环境的以上配置


## 获取方式
配置的获取需要通过调接口的形式来获取，根据需要传的参数又分以下两种途径

### 在发布配置的钩子内获取

- 请求地址：`/api/apis/config/`
- 请求方法： `GET`
- 请求参数：

    | 参数名 | 类型 | 必填 | 默认值 | 示例 | 说明 |
    | --- | :---: | :---: | --- | --- | --- |
    | apiToken | string | 是 | | $SPUG_API_TOKEN | 固定值，`Spug` 内置的全局变量，仅可在发布配置的钩子中引用 |
    | format   | string | 否 | kv | json  | 返回的格式，目前支持 `kv` 和 `json` 两种格式，分别对应 `key = value` 和 `{"key": "value"}` |

- 使用示例
    
    以下截图即在 `应用发布前` 中调用了获取配置的接口，将会把该应用该环境下的配置保存在 `.env` 文件中。
    
    ![about](http://cdn.qbangmang.com/spug/api-config.jpg)

### 独立使用

- 请求地址：`/api/apis/config/`
- 请求方法： `GET`
- 请求参数：

    | 参数名 | 类型 | 必填 | 默认值 | 示例 | 说明 |
    | --- | :---: | :---: | --- | --- | --- |
    | apiKey | string | 是 | | JLV8IGO0DhoxcM7I | 调用接口的访问凭据，在 `Spug` 系统管理/系统设置/开放服务设置 中配置，请勿泄露给他人 |
    | app | string | 是 | | order | 指定要获取其配置的应用的标识符（创建应用时设置的该标识符，请在应用管理或应用配置页面查看应用的标识符） |
    | env | string | 是 | | dev | 指定获取应用所在环境的标识符（创建环境时设置的该标识符，请在 配置中心/环境管理页面查看环境标识符）
    | format   | string | 否 | kv | json  | 返回的格式，目前支持 `kv` 和 `json` 两种格式，分别对应 `key = value` 和 `{"key": "value"}` |

- 使用示例
    
    ```shell script
    curl "https://demo.spug.dev/api/apis/config/?apiKey=JLV8IGO0DhoxcM7I&app=order&env=test"
    ```
    输出如下
    ```shell script
    db_order_database = order
    db_order_host = 172.26.89.90
    db_order_password = 123456
    db_order_port = 3306
    db_order_username = root
    order_app_debug = true
    order_cache_driver = file
    order_url = http://test-order.internal.com
    redis_host = 127.0.0.1
    redis_password = 123456
    ```
