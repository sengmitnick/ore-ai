# Ore AI

> 聊天智能助手 AI对话写作

## 初始化

### mysql

以下是在本地通过 docker 快速安装
``` bash
docker pull mysql:latest
docker run -itd --name mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```

.env.local
``` env
NEXT_PUBLIC_MYSQL_HOST=localhost
NEXT_PUBLIC_MYSQL_PASSWORD=123456
NEXT_PUBLIC_MYSQL_PORT=3306
NEXT_PUBLIC_MYSQL_USER=root
```