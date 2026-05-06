需要创建一个 db 文件夹，作为 mysql 的挂载卷。

在 Node 项目里的数据库配置必须写成

```js

host: 'mysql',  // 就是 docker-compose 里的服务名，不能写 localhost
port: 3306,     // 容器内部端口，不是 3391
user: 'root',
password: 'root'

```
