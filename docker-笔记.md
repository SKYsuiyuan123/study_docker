## Docker 镜像和容器

新版本标准命令，遵循 Docker 分组语法: `docker 资源类型 操作`

### 镜像相关命令

拉取镜像 (默认从官方源拉取)

```shell
# docker pull 镜像名:版本号(默认 latest)
$ docker pull tomcat

# 从指定仓库拉取
$ docker pull daoclound.io/library/tomcat:8
```

删除镜像

```shell
# docker rmi 镜像名/镜像id
$ docker rmi tomcat

# docker rmi 镜像名/镜像id:TAG(版本号)
$ docker rmi tomcat:latest

# 删除 name 为空的镜像(Docker 清理悬空镜像 的常用命令)
$ docker image prune -f

# 清理所有未被使用的镜像(包括悬空 + 闲置)
$ docker image prune -a -f
```

列出镜像

```shell
# 列出所有镜像
$ docker images

# 列出所有悬空镜像
$ docker images -f dangling=true
```

镜像的导入和导出

```shell
# 导出

# docker save -o 导出的路径 镜像id/镜像名
$ docker save -o /Users/sky/Desktop/study_github/study_docker/backup_images_demo/test-tomcat-i.tar tomcat

# 导入

# docker load -i 镜像文件
$ docker load -i /Users/sky/Desktop/study_github/study_docker/backup_images_demo/test-tomcat-i.tar
```

修改镜像名称

```shell
# docker tag 镜像id 镜像名称:镜像版本
$ docker tag tomcat tomcat:latest-v1
```

### 容器相关命令（不包含 创建容器）

列出容器

```shell
# 查看正在运行中的 (ps 取自进程 process)
$ docker ps

# or docker 资源类型 操作 (新版、规范、结构化、推荐)

$ docker container ls

# 只查看 运行中的容器的标识(只列出 容器ID)
$ docker ps -q

# 查看所有容器(包括运行中的 和 已经停止的)
$ docker ps -a

# 查看 所有容器的 容器ID
$ docker ps -qa
```

停止容器

```shell
# docker stop 容器名/容器ID (新版：docker container stop 容器名/容器ID)
$ docker stop tomcat-1

# 30秒 后停止容器
# docker stop -t 30 容器名
$ docker stop -t 30 tomcat-1

# 停止所有容器
$ docker stop $(docker ps -qa)

# 强制立刻停止 (相当于杀进程)
# docker kill 容器名/容器ID (新版: docker container kill 容器名/容器ID)
$ docker kill tomcat-1

区别：
	- stop: 优雅停止，会给容器几秒钟收尾时间（默认 10秒），正常关机。
	- kill: 强制硬杀，直接终止进程，来不及保存数据。
```

启动容器 (启动已停止的容器)

```shell
# docker start 容器名/容器ID
$ docker start tomcat-1
```

重启容器 (也可以启动 已停止的容器)

```shell
# docker restart 容器名/容器ID
$ docker restart tomcat-1
```

删除容器 (删除容器时，必须先停止容器)

```shell
# docker rm 容器名/容器ID
$ docker rm tomcat-1

# 删除所有容器
$ docker rm $(docker ps -qa)
```

进入容器内部

```shell
# docker exec -it 容器名/容器ID bash
$ docker exec -it tomcat-1 bash
```

查看容器日志 (实时日志，退出使用 control + c)

```shell
# docker logs -f 容器名/容器ID
# -f: 滚动查看最后几行

$ docker logs tomcat-1

# 查看 容器最后五行 日志
$ docker logs --tail=5 tomcat-1
```

查看容器 IP 地址

```shell
# docker inspect 容器名称/容器ID
# 在返回数据里 查找 NetworkSettings.IPAddress

$ docker inspect tomcat-1
```

### 创建容器

每一个容器，它都有自己的文件系统 rootfs



创建并运行容器 (容器一旦创建，端口、名字、后台运行模式 都不能修改，只能删除重建)

1. 容器名是唯一的，不能重复。
2. 原本容器有的参数 不行覆盖就可以不用配置，容器会使用镜像默认的。

```shell
# docker run -d -p 宿主机端口:容器内部端口 --name 容器名 镜像名:镜像版本(默认是 latest)
# -d: 以后台进程运行 (没有后台进程运行的容器，启动后会 关机(停止))
# -it：启动后进入 bash 终端 (以交互方式创建容器)(一般不用)

$ docker run -d -p 8081:8080 --name tomcat-1 tomcat
```

文件拷贝 (一般不推荐)

```shell
# 从外部 拷贝到 容器 (需要确保容器内的目录存在，比如下面的要先进入容器内 创建 ROOT 目录。) (访问 http://localhost:8081 可以看到该文件)
# docker cp 需要拷贝的文件或目录 容器名称:容器目录
$ docker cp /Users/sky/Desktop/study_github/study_docker/copy_demo/demo1/index.html tomcat-1:/usr/local/tomcat/webapps/ROOT

# 拷贝一个图片到 容器内 (访问 http://localhost:8081/WX20250705-120315@2x.png)
$ docker cp /Users/sky/Desktop/study_github/study_docker/copy_demo/demo1/WX20250705-120315@2x.png tomcat-1:/usr/local/tomcat/webapps/ROOT

# 从容器内 拷贝到 外部(宿主机)
# docker cp 容器名称:容器目录 需要拷贝的文件或目录

$ docker cp tomcat-1:/usr/local/tomcat/webapps/ROOT/index.html /Users/sky/Desktop/study_github/study_docker/copy_demo/demo2

$ docker cp tomcat-1:/usr/local/tomcat/webapps/ROOT /Users/sky/Desktop/study_github/study_docker/copy_demo/demo3
```

启动容器时 加入网段

```shell
# 加入同一网段
# --network nginx-tomcat-net-1

$ docker run -d --name tomcat-2 -p 8082:8080 --network nginx-tomcat-net-1 tomcat
```

创建数据卷 (数据卷：内部外部都可以修改) (推荐方式，因为 宿主机中就可以操作容器中的目录)

```shell
# -v 宿主机目录地址:容器内目录地址

$ docker run -d --name tomcat-2 -p 8082:8080 -v /Users/sky/Desktop/study_github/study_docker/volume_demo/demo1:/usr/local/tomcat/webapps/ROOT tomcat
```





## 自定义镜像
