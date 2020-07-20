---
id: deploy-product
title: 手动部署
---

> 我们推荐你使用 [Docker安装](/docs/install-docker) 来确保体验的一致性，同时提供了 [一键安装脚本](/docs/deploy-product-script)，用于简单快速部署。

## 准备环境

- Python 3.6及以上
- Mysql 5.5及以上
- 现代浏览器

## 安装步骤
以下安装步骤假设项目部署在一台 `Centos7` 系统的 `/data/spug` 目录下。

### 1. Clone项目代码
```shell script
$ git clone https://github.com/openspug/spug /data/spug
$ cd /data/spug
$ git checkout x.x.x   # x.x.x 为指定的发行版本，例如 git checkout v2.2.2 
```

### 2. [下载](https://github.com/openspug/spug/releases) 已编译打包后的前端项目
将下载好的前端压缩包解压到指定目录，`x.x.x` 是的你下载好的压缩包版本
> 访问 [`Github`](https://github.com/openspug/spug/releases) 比较慢的情况下，可以在尝试在 [`Gitee`](https://gitee.com/openspug/spug/releases) 下载。
```
$ tar xf spug_web_x.x.x.tar.gz -C /data/spug/spug_web/;
```

### 3. 创建运行环境
```shell script
# 安装依赖
$ yum install mariadb-devel python3-devel gcc openldap-devel redis nginx supervisor

# 创建虚拟环境
$ cd /data/spug/spug_api
$ python3 -m venv venv
$ source venv/bin/activate

# 安装python包
$ pip install -r requirements.txt -i https://pypi.doubanio.com/simple/
$ pip install gunicorn mysqlclient -i https://pypi.doubanio.com/simple/
```

### 4. 修改后端配置
后端默认使用的 `Sqlite` 数据库，通过修改配置使用 `MYSQL` 作为后端数据库，[如何使用SqlServer数据库？](/docs/install-error#%E4%BD%BF%E7%94%A8-sqlserver-%E6%95%B0%E6%8D%AE%E5%BA%93)
> 在 `spug_api/spug/` 目录下创建 `overrides.py` 文件，启动后端服务后会自动覆盖默认的配置，避免直接修改 `settings.py` 以便于后期获取新版本。
```shell script
$ vi spug_api/spug/overrides.py

DEBUG = False

DATABASES = {
    'default': {
        'ATOMIC_REQUESTS': True,
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'spug',             # 替换为自己的数据库名，请预先创建好编码为utf8mb4的数据库
        'USER': 'spug_user',        # 数据库用户名
        'PASSWORD': 'spug_passwd',  # 数据库密码
        'HOST': '127.0.0.1',        # 数据库地址
        'OPTIONS': {
            'charset': 'utf8mb4',
            'sql_mode': 'STRICT_TRANS_TABLES',
            #'unix_socket': '/opt/mysql/mysql.sock' # 如果是本机数据库,且不是默认安装的Mysql,需要指定Mysql的socket文件路径
        }
    }
}
```

### 5. 初始化数据库
```shell script
$ cd /data/spug/spug_api
$ python manage.py initdb
````
### 6. 创建默认管理员账户
```shell script
$ python manage.py useradd -u admin -p spug.dev -s -n 管理员

# -u 用户名
# -p 密码
# -s 超级管理员
# -n 用户昵称
```

### 7. 创建启动服务脚本
```shell script
$ vi /etc/supervisord.d/spug.ini

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

```

### 8. 创建前端nginx配置文件
```
$ vi /etc/nginx/conf.d/spug.conf

server {
        listen 80;
        server_name _;     # 修改为自定义的访问域名
        root /data/spug/spug_web/build/;
        client_max_body_size 20m;   # 该值会影响文件管理器可上传文件的大小限制，请合理调整

        gzip  on;
	    gzip_min_length  1k;
	    gzip_buffers     4 16k;
	    gzip_http_version 1.1;
	    gzip_comp_level 7;
	    gzip_types       text/plain text/css text/javascript application/javascript application/json;
        gzip_vary on;

        location ^~ /api/ {
                rewrite ^/api(.*) $1 break;
                proxy_pass http://127.0.0.1:9001;
                proxy_read_timeout 180s;
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
> 注意：如果你没有在 `spug.conf` 中指定 `server_name` 则需要把 `/etc/nginx/nginx.conf` 中默认的 `server` 块注释或删除后才能正常访问，
> 否则会打开 Nginx 默认页面。

### 9. 启动服务
```shell script
# 设置开机启动
$ systemctl enable nginx
$ systemctl enable redis
$ systemctl enable supervisord

# 启动服务
$ systemctl restart nginx
$ systemctl restart redis
$ systemctl restart supervisord
```

### 10. 访问测试
通过浏览器访问测试。


### 11. 安全建议
> - 请确保安装的 `Redis` 仅监听在 `127.0.0.1`。如果需要使用密码认证的 `Redis` 请参考 [如何配置使用带密码的 Redis 服务？](/docs/install-error/#%E5%A6%82%E4%BD%95%E9%85%8D%E7%BD%AE%E4%BD%BF%E7%94%A8%E5%B8%A6%E5%AF%86%E7%A0%81%E7%9A%84-redis-%E6%9C%8D%E5%8A%A1%EF%BC%9F)
> - 确保服务端接收到请求 `HTTP Header` 的 ` X-Real-IP` 为真实的客户端地址，`Spug` 会使用该 IP 提高安全性（当登用户的 IP 发生变化时 Token 自动失效）。
