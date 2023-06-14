# Ore AI

> 聊天智能助手 AI 对话写作

## 初始化

### mysql

以下是在本地通过 docker 快速安装

```bash
# 安装并运行
docker pull mysql:latest
docker run -itd --name mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql

# 设置环境变量
export MYSQL_USER=root MYSQL_PASSWORD=123456 MYSQL_HOST=localhost MYSQL_PORT=3306 DB_NAME=ore_ai_db
export DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${DB_NAME}"

# 初始化数据
npx prisma migrate dev --name init

# 新增model
npx prisma migrate dev --name add-profile

# 重新初始化数据
npx prisma migrate reset --preview-feature
```
