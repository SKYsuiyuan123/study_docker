# MySQL 9.2.0 Docker 主从复制 完整笔记
## 环境说明
- 镜像版本：`mysql:9.2.0`
- 主库：`mysql-master-test-1` 端口 **3315**
- 从库：`mysql-slave-test-1` 端口 **3316**
- 关键变化：MySQL9.x 废弃旧主从语法，改用新语法

---

## 一、主库启动命令
```bash
docker run -d \
-p 3315:3306 \
--name mysql-master-test-1 \
--restart=always \
-v /Users/sky/Desktop/study_github/study_docker/mysql_demo/demo1/log:/var/log/mysql \
-v /Users/sky/Desktop/study_github/study_docker/mysql_demo/demo1/data:/var/lib/mysql \
-v /Users/sky/Desktop/study_github/study_docker/mysql_demo/demo1/conf:/etc/mysql/conf.d \
-e MYSQL_ROOT_PASSWORD=123456 \
-e TZ=Asia/Shanghai \
mysql \
--character-set-server=utf8mb4 \
--collation-server=utf8mb4_unicode_ci \
--server-id=1 \
--log-bin=mysql-bin \
--binlog-format=ROW
```

## 二、从库启动命令
```bash
docker run -d \
-p 3316:3306 \
--name mysql-slave-test-1 \
--restart=always \
-v /Users/sky/Desktop/study_github/study_docker/mysql_demo/demo2/log:/var/log/mysql \
-v /Users/sky/Desktop/study_github/study_docker/mysql_demo/demo2/data:/var/lib/mysql \
-v /Users/sky/Desktop/study_github/study_docker/mysql_demo/demo2/conf:/etc/mysql/conf.d \
-e MYSQL_ROOT_PASSWORD=123456 \
-e TZ=Asia/Shanghai \
mysql \
--character-set-server=utf8mb4 \
--collation-server=utf8mb4_unicode_ci \
--server-id=2
```
> 注意：主库 `server-id=1`，从库 `server-id=2` 必须不同

---

## 三、主库配置（创建复制账号）
1. 进入主库
```bash
docker exec -it mysql-master-test-1 mysql -uroot -p123456
```

2. 逐条执行授权
```sql
-- 创建复制用户
CREATE USER 'repl'@'%' IDENTIFIED BY '123456';

-- 授予复制权限
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- 刷新权限
FLUSH PRIVILEGES;
```

3. 查看主库 Binlog 信息（9.x 新版语法）
```sql
SHOW BINARY LOG STATUS;
```
记录：`File` 日志名、`Position` 偏移量

---

## 四、从库配置关联主库
1. 进入从库
```bash
docker exec -it mysql-slave-test-1 mysql -uroot -p123456
```

2. 停止并重置复制
```sql
STOP REPLICA;
RESET REPLICA;
```

3. 关联主库（替换自己查到的日志文件和位置）
```sql
CHANGE REPLICATION SOURCE TO
SOURCE_HOST='host.docker.internal',
SOURCE_PORT=3315,
SOURCE_USER='repl',
SOURCE_PASSWORD='123456',
SOURCE_LOG_FILE='mysql-bin.000001',
SOURCE_LOG_POS=156;
```

4. 启动从库复制
```sql
START REPLICA;
```

5. 查看从库状态（9.x 新版）
```sql
SHOW REPLICA STATUS\G
```
✅ 成功标准：
`Replica_IO_Running: Yes`
`Replica_SQL_Running: Yes`

---

## 五、主从同步测试语句
### 主库执行
```sql
-- 创建库
CREATE DATABASE test_sync;

USE test_sync;

-- 创建表
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    age INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入数据
INSERT INTO user(name,age) VALUES ('张三',20),('李四',25);
```

### 从库查询验证
```sql
USE test_sync;
SELECT * FROM user;
```

---

## 六、MySQL9.x 新旧语法对照表
| 作用 | 废弃旧语法 | 9.x 新语法 |
|------|------------|------------|
| 查看主库状态 | show master status; | SHOW BINARY LOG STATUS; |
| 查看从库状态 | show slave status\G | SHOW REPLICA STATUS\G |
| 配置主从 | change master to | CHANGE REPLICATION SOURCE TO |
| 启停从库 | start slave / stop slave | START REPLICA; / STOP REPLICA; |

---

## 七、常用维护命令
```sql
-- 从库停止复制
STOP REPLICA;

-- 从库启动复制
START REPLICA;

-- 重置从库复制配置
RESET REPLICA;

-- 查看是否开启binlog
show variables like 'log_bin';
```
