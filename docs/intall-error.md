---
id: install-error
title: 常见问题
---

## 安装部署常见问题

### 执行数据初始化命令 `python manage.py updatedb` 报错
一般有以下两种情况
    
- `Django` 版本使用了 3.x 的版本，我们仅支持 2.2.x 版本，安装依赖推荐使用文档中的 `pip install -r requirements.txt` 来安装
- 系统的 Sqlite 版本太低，`Django 2.2` Sqlite 的版本最低要求为 3.8.3 [参见文档](https://docs.djangoproject.com/en/2.2/releases/2.2/)。

### `Nginx` 访问前端文件提示无权限问题
确认系统是否开启了 `selinux`。如果开启可通过执行 `setenforce 0` 来临时关闭后重试。
 
### 登录报错 `请求失败: 504 Gateway Timeout`
请确保 api 服务是否启动，如果已启动则可以通过控制台查看是否监听在 `8000` 端口，如果不是 `8000` 端口可以改为 `8000` 端口或者修改前端项目的
`spug/spug_web/src/setupProxy.js` 文件中的 `target` 值为你的 api 服务的监听地址和端口。

### 登录报错 `请求失败: 502 Bad Gateway`
请确保 api 服务已正常启动且 `nginx` 配置正确。另可查看 `nginx` 日志如有发现 `13: Permission denied` 字样的报错则可尝试关闭 `selinux` 后再测试。

### 登录报错 `Exception: Error 61 connecting to 127.0.0.1:6379. Connection refused.`
需要安装 `Redis`，如果安装的 `Redis` 不是监听在 `127.0.0.1` 需要修改配置文件 `spug_api/spug/settings.py`
指定 `Redis` 的 Host，配置中的 `CACHES` 和 `CHANNEL_LAYERS` 均使用了 `Redis`。

### 添加主机报错 `Exception: not a vaild RSA private key file`
当 `Spug` 生成的密钥对无法通过验证时，会尝试读取系统的 `~/.ssh/` 目录下的密钥进行验证，这个报错一般是在读取系统密钥时出错。 可以尝试先移除系统
的密钥，然后再操作添加主机，等添加完成后再恢复原有的密钥。

### 如何配置使用带密码的 `Redis` 服务？
假设 `Redis` 密码为 `foo123`，则需要更改以配置文件 `spug_api/spug/overrides.py`（推荐） 或者 `settings.py`（影响后续版本升级） 如下内容，修改完成后记得重启服务。
> 自定义的配置可以在 `spug_api/spug/` 目录下创建 `overrides.py` 文件来覆盖默认的配置。
```shell script
$ vi spug_api/spug/settings.py

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://:foo123@127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": ["redis://:foo123@127.0.0.1:6379/0"],
        },
    },
}
```

### 使用 `SqlServer` 数据库
感谢 @xiongwu1 提供的支持，请参考 [#38](https://github.com/openspug/spug/issues/38)

## 使用常见问题

### 使用 `nohup` 启动后台进程页面一直在转圈不会结束？
在 [`批量执行`](/docs/batch-exec/) 或 [`发布配置`](/docs/deploy-config/) 等的执行脚本中以 `nohup` 或 `&` 的方式启动后台子进程时需要
把命令的标准输出重定向至 `/dev/null`，例如以下启动 `Tomcat` 的命令：
```shell script
cd web/WEB-INF/
nohup ./startup.sh &
```
把上述命令改为：
```shell script
cd web/WEB-INF/
nohup ./startup.sh > /dev/null &
```

### 能否使用自己的密钥对？
可以，`v2.3.0` 版本开始已支持上传自定义密钥对，可以在 `系统管理 \ 系统设置 \ 密钥设置` 中，自行上传密钥。

### 新建常规发布申请 `git clone` 错误
`Spug` 无法提供交互式的输入账户密码登录git仓库的能力，如果是公开的仓库 `http/https/ssh` 任何一种协议都可以，但如果是私有仓库推荐使用
`ssh` 协议配置密钥来访问。`http/https` 协议则需要在带上用户名和密码，例如 `https://yourname:password@gitee.com/openspug/spug.git`
如果账户名中包含了 `@` 符号，则需要替换成 `%40`。特别要注意的是，如果你是通过docker方式部署的则需要确保在容器内可以访问仓库，而不是在宿主机上。

### 主机 `Console` 或执行发布页面无内容
这种情况大部分都是 `Websocket` 连接建立失败了，一般出现在部署时自己加了一层 nginx 之类的代理工具，这些代理工具默认无法处理 `Weboscket` 请求，
这就需要你配置其支持转发 `Websocket` 请求，下边给个 `Nginx` 的例子，这里假设你用 docker 部署的 `Spug`, 映射了宿主机的 8000 端口：
```shell script
server {
  listen 80;
  server_name xxx.xxx.xxx;
  
  location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
 
  location ^~ /api/ws/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  error_page 404 /index.html;
}
```

### 文件管理器上传文件报错 `413 Request Entity Too Large`
文件上传大小受 `Nginx` 的 `client_max_body_size` 影响，请修该值至合适的大小，参考以下配置：
> docker 方式部署配置文件位于容器内的 `/etc/nginx/nginx.conf`, 可以在容器外部编辑后通过 `docker cp` 至容器内，也可以在容器内执行
> `vi` 在容器内直接修改，最后别忘了重启容器。
```shell script
server {
  listen 80;
  server_name xxx.xxx.xxx;
  client_max_body_size 100m;

  ...
}
```

### 钉钉收不到通知？
钉钉机器人安全设置中 **IP地址** 添加部署 `Spug` 的服务器的公网地址，或者使用 **自定义关键词** 填写 `通知`，如下图

![about](/images/install-error-dd.png)

### Docker 部署使用外部 `Mysql`
官方 Docker 镜像内置了数据库服务，如果你想使用自己的外部数据库，可以通过如下方法：
> 如果需要迁移数据，请查看 [版本升级注意事项](/docs/update-version)，以免造成后期无法升级新版本。
```shell script
# 1. 进入容器
$ docker exec -it spug bash

# 2. 修改配置文件使访问外部数据库
$ vi /data/spug/spug_api/spug/overrides.py

DATABASES = {
    'default': {
        'ATOMIC_REQUESTS': True,
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'spug',
        'USER': 'spug',  # 修改为外部数据库的用户
        'PASSWORD': 'spug.dev',  # 修改为外部数据的用户密码
        'HOST': 'localhost',    # 修改为外部数据的ip
        'OPTIONS': {
            'unix_socket': '/var/lib/mysql/mysql.sock',   # ！！！删除该行
            'charset': 'utf8mb4',
            'sql_mode': 'STRICT_TRANS_TABLES',
        }
    }
}

# 3. 停止容器内的数据库服务
$ vi /etc/supervisord.d/spug.ini

# 找到如下行并删除
[program:mariadb]
command = /usr/libexec/mysqld --user=mysql
autostart = true

# 4. 退出并重启容器
$ exit
$ docker restart spug
```

## 二次开发常见问题


### 标准安装批量执行的任务卡住无法看到执行输出
批量执行功能需要启动额外服务，通过以下命令启动，以下操作命令基于 [标准安装](/docs/install) 文档的环境
```shell script
$ cd /data/spug/spug_api
$ source venv/bin/activate
$ python manage.py runworker
```

### 标准安装任务计划模块添加的任务不会执行
任务计划功能需要启动额外的服务，通过以下命令启动，以下操作命令基于 [标准安装](/docs/install) 文档的环境
```shell script
$ cd /data/spug/spug_api
$ source venv/bin/activate
$ python manage.py runscheduler
$ python manage.py runworker
```

### 标准安装监控中心模块添加的监控任务不会执行
监控中心功能需要启动额外的服务，通过以下命令启动，以下操作命令基于 [标准安装](/docs/install) 文档的环境
```shell script
$ cd /data/spug/spug_api
$ source venv/bin/activate
$ python manage.py runmonitor
$ python manage.py runworker
```

### `macOS` 如何使用 `Mysql` 替代默认的 `Sqlite` 数据库？
需要安装 `mysqlclient` 数据库驱动库，可通过以下步骤安装
```shell script
$ brew install mysql-client
$ export PATH="/usr/local/opt/mysql-client/bin:$PATH"
$ export LDFLAGS="-I/usr/local/opt/openssl/include -L/usr/local/opt/openssl/lib"
$ pip install mysqlclient
```