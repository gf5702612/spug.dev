---
id: install
title: 标准安装
---

## 支持环境

- Python 3.6及以上
- Nodejs 12.14 TLS （也可以直接下载编译后的前端项目，则无需Nodejs）
- 现代浏览器

## 安装步骤
以下安装步骤假设项目部署在一台 `Centos7` 系统的 `/data/spug` 目录下。

### 1. Clone项目代码

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

### 3. 安装运行依赖
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

## 编译前端（可选）
前端项目可直接从github下载编译后的，可略过此步骤。

### 1. 安装Nodejs
请从 [Nodejs官方](https://nodejs.org/en/download/) 下载合适的包，安装 Nodejs。

### 2. 安装依赖
```shell script
cd /data/spug/spug_web
npm install
```

### 3. 编译项目
编译后的文件位于 `/data/spug/spug_web/build` 。
```shell script
npm run build
```
