---
id: deploy-product
title: 生产环境部署
---

## 准备环境

- Python 3.6及以上
- Mysql 5.5及以上
- 现代浏览器

## 安装步骤
以下安装步骤假设项目部署在一台 `Centos7` 系统的 `/data/spug` 目录下。

### 1. Clone项目代码
前端可直接 [下载](https://github.com/openspug/spug/releases) 已编译打包后的压缩包
```shell script
git clone https://github.com/openspug/spug /data/spug

# 下载已编译打包后的前端项目
tar xf spug_web.tar.gz -C /data/spug/spug_web/build;
```

### 2. 创建运行环境
```shell script
yum install mariadb-devel python3-devel gcc
cd /data/spug/spug_api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn mysqlclient
```

### 3. 修改配置
默认使用的 `Sqlite` 数据库，通过修改配置使用 `MYSQL`。
> 自定义的配置可以在 `spug_api/spug/` 目录下创建 `overrides.py` 文件来覆盖默认的配置。
```shell script
vi spug/overrides.py
DEBUG = False
ALLOWED_HOSTS = ['127.0.0.1']

DATABASES = {
    'default': {
        'ATOMIC_REQUESTS': True,
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ops',  # 替换为自己的数据库名，请预先创建好编码为utf8mb4的数据库
        'USER': 'ops',  # 用户名
        'PASSWORD': 'Ogg45YqX5mlseDWu',  # 密码
        'HOST': '127.0.0.1',  # 地址
        'OPTIONS': {
            'charset': 'utf8mb4',
            'sql_mode': 'STRICT_TRANS_TABLES'
        }
    }
}
```

### 4. 安装运行依赖
```shell script
yum install nginx supervisor redis
# 创建 supervisor 配置
vi /etc/supervisord.d/ops.ini
[program:spug-api]
command = bash /data/spug/spug_api/tools/start-api.sh
autostart = true
stdout_logfile = /data/spug/spug_api/logs/api.log
redirect_stderr = true

[program:spug-ws]
command = bash /data/spug/spug_api/tools/start-ws.sh
autostart = true
stdout_logfile = /data/spug/spug_api/logs/ws.log
redirect_stderr = true

[program:spug-worker]
command = bash /data/spug/spug_api/tools/start-worker.sh
autostart = true
stdout_logfile = /data/spug/spug_api/logs/worker.log
redirect_stderr = true

[program:spug-monitor]
command = bash /data/spug/spug_api/tools/start-monitor.sh
autostart = true
stdout_logfile = /data/spug/spug_api/logs/monitor.log
redirect_stderr = true

[program:spug-scheduler]
command = bash /data/spug/spug_api/tools/start-scheduler.sh
autostart = true
stdout_logfile = /data/spug/spug_api/logs/scheduler.log
redirect_stderr = true

# 创建 nginx 配置
vi /etc/nginx/conf.d/ops.conf
server {
        listen 80;
        server_name _;
        root /data/spug/spug_web/build/;

        location ^~ /api/ {
                rewrite ^/api(.*) $1 break;

                proxy_pass http://127.0.0.1:9001;
                proxy_redirect off;
                proxy_set_header X-Real-IP $remote_addr;
        }

        location ^~ /api/ws/ {
                rewrite ^/api(.*) $1 break;

                proxy_pass http://127.0.0.1:9002;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "Upgrade";
                proxy_set_header X-Real-IP $remote_addr;
        }


        error_page 404 /index.html;
}
```

### 4. 启动服务
```shell script
# 设置开机启动
systemctl enable nginx
systemctl enable redis
systemctl enable supervisor

# 启动服务
systemctl restart nginx
systemctl restart redis
systemctl restart supervisor
```

### 5. 访问测试
通过浏览器访问测试。

## 安全建议
- 请确保安装的 `Redis` 仅监听在 `127.0.0.1`。如果需要使用密码认证的 `Redis` 请参考 [如何配置使用带密码的 Redis 服务？](https://spug.dev/docs/install-error/#%E5%A6%82%E4%BD%95%E9%85%8D%E7%BD%AE%E4%BD%BF%E7%94%A8%E5%B8%A6%E5%AF%86%E7%A0%81%E7%9A%84-redis-%E6%9C%8D%E5%8A%A1%EF%BC%9F)
- 确保服务端接收到请求 `HTTP Header` 的 ` X-Real-IP` 为真实的客户端地址，`Spug` 会使用该IP提高安全性（当登用户的IP发生变化时Token自动失效）。
