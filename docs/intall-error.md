---
id: install-error
title: 安装问题
---

## 常见安装问题

### 登录报错 `Exception: Error 61 connecting to 127.0.0.1:6379. Connection refused.`

需要安装 `Redis`，如果安装的 `Redis` 不是监听在 `127.0.0.1` 需要修改配置文件 `spug_api/spug/settings.py`
指定 `Redis` 的 Host，配置中的 `CACHES` 和 `CHANNEL_LAYERS` 均使用了 `Redis`。

