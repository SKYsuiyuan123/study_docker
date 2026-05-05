## Docker 镜像和容器

当容器启动时，一个新的可写层被加载到镜像的顶部。这一层通常被称为 “容器层”，“容器层”之下的都叫“镜像层”。



Mysql Redis 等存储数据类应用，不推荐使用 Docker。



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

### 搭建私有镜像仓库

搭建步骤

```shell
# 1. 拉取私有仓库镜像
$ docker pull registry

# 2. 启动私有仓库容器 (5000 端口是被占用的)
$ docker run -d --name registry-test-1 -p 5001:5000 registry

# -v 添加数据卷挂载
$ docker run -d --name registry-test-2 -p 5002:5000 -v /Users/sky/Desktop/study_github/study_docker/registry_demo/:/var/lib/registry registry

# 3. 打开浏览器输入地址 http://127.0.0.1:5001/v2/_catalog 看到 {"repositories": []} 表示私有仓库搭建成功并且内容为空

# 4. 修改 daemon.json (本地可以使用 docker destop 修改里边的 Docker Engine)
$ vi /etc/docker/daemon.json
# 添加以下内容，保存并退出。(私服地址:端口)
# {"insecure-registries": ["127.0.0.1:5001"]}
# 这步是用于让 docker 信任私有仓库地址

# 5. 重启 docker 服务
$ restart docker

# 6. 开启 私有仓库容器
$ docker start registry-test-1
```

### 镜像上传到私有仓库

操作步骤

```shell
# 1. 标记此镜像为私有仓库的镜像
# docker tag 镜像名 127.0.0.1:5001/标签名:Tag

$ docker tag tomcat 127.0.0.1:5001/test-tomcat-image-1.0.1

$ docker tag tomcat 127.0.0.1:5001/test-tomcat-image-1.0.1:1.0.1

# 查看 刚刚 commit 过的镜像，镜像名：127.0.0.1:5001/test-tomcat-image-1.0.1
$ docker images;

# 2. 上传标记的仓库
$ docker push 127.0.0.1:5001/test-tomcat-image-1.0.1

# 3. 打开浏览器输入地址 http://127.0.0.1:5001/v2/_catalog 验证 {"repositories": ["test-tomcat-image-1.0.1"]} 表示 已上传成功

# 4. 其它电脑拉取
# 	a. 配置 docker 信任私有仓库地址
#		b. docker pull 镜像名 拉取镜像

$ docker pull 127.0.0.1:5001/test-tomcat-image-1.0.1
```

### 私有仓库  添加安全认证

需要生成安全证书，防止别人随意提交 和 删除。

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

# 查看最后启动的一个容器
$ docker ps -l

# 查看最近创建的 n 个容器
$ docker ps -n 5

# 查看命令帮助
docker ps --help
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
# 也可以查看 容器的 详细信息，比如查看挂载卷：Mounts.Source

$ docker inspect tomcat-1

# 直接输出 ip 地址 172.17.0.2
$ docker inspect --format='{{.NetworkSettings.IPAddress}}' tomcat-1
```

### 创建容器

每一个容器，它都有自己的文件系统 rootfs

容器必须有前台任务在执行，不然容器会直接退出。(比如直接：**docker run node**)



**创建并运行容器** (容器一旦创建，端口、名字、后台运行模式 都不能修改，只能删除重建)

1. 容器名是唯一的，不能重复。
2. 原本容器有的参数 不行覆盖就可以不用配置，容器会使用镜像默认的。

```shell
# docker run -d -p 宿主机端口:容器内部端口 --name 容器名 镜像名:镜像版本(默认是 latest)
# -d: 以后台进程运行 (没有后台进程运行的容器，启动后会 关机(停止))
# -it: 启动后进入 bash 终端 (以交互方式创建容器)(一般不用)
# --network: 指定网络模式,默认 bridge 模式，可以指定 网络模式。

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

### Docker 网络命令

查看网络

```shell
$ docker network ls
```

创建网络

```shell
# docker network create 网络名字
# 创建 docker 内部网络，不创建该网络，docker 内部的服务之间无法互相访问。

$ docker network create nginx-tomcat-net-2
```

删除网络

```shell
# docker network rm 网络名字
$ docker network rm nginx-tomcat-net-2

# 删除 所有 没有被容器使用的 自定义网络
$ docker network prune
```

**三个默认网络**

`bridge`: 默认网桥 (docker0)，普通容器默认都连它。

`host`: 直接用宿主机网络栈。

`none`: 无网络，只有回环口。

| 网络   | 核心特点           | 端口映射 | 隔离性           |
| ------ | ------------------ | -------- | ---------------- |
| bridge | 独立 IP，容器互通  | 需要 -p  | 中等（推荐默认） |
| host   | 共用宿主机 IP 网卡 | 不需要   | 无隔离           |
| none   | 完全断网           | 无意义   | 最强隔离         |

同一个 docker-compose.yml 里的所有容器，默认会自动创建一个专属网络，互相之间可以直接用 服务名/容器名 就能访问，完全不用写 IP。

Compose 会**自动创建一个专属网桥** (自定义 bridge 类型)名字一般是: `项目名_default`

同一个 `docker-compose` 里的容器：

✅ 使用 **自动创建的自定义 bridge 网络**

✅ **可以互相访问**

✅ **直接用服务名（yaml 里的名字）访问，不用 IP**

### Docker volume 命令

创建 volume

```shell
# docker volume create 数据卷名称
$ docker volume create tomcat-volume-1
```

查看 volume

```shell
$ docker volume ls

# 查看 dangling(未被容器引用的)匿名卷 即：悬空卷
$ docker volume ls -f dangling=true

# 查看数据卷详细信息 (可以查看 数据卷的地址，创建时间。)
# docker volume inspect 数据卷名称

$ docker volume inspect tomcat-volume-1
```

删除数据卷

```shell
# docker volume rm 数据卷名称
$ docker volume rm tomcat-volume-1

# 只删除 dangling 卷 (悬空卷)
$ docker volume prune

# or:

$ docker volume prune -f
```

应用数据卷 (挂载数据卷)

```shell
# 1. 具名挂载：当你映射数据卷时，如果数据卷不存在，Docker 会帮你自动创建。(会将容器内部自带的文件存储在默认的存放路径中) (Mounts.Name: tomcat-volume-1)
# docker run -v 数据卷名称:容器内部的路径 镜像ID

$ docker run --name tomcat-1 -p 8081:8080 -d -v tomcat-volume-1:/usr/local/tomcat/webapps/ROOT tomcat

# 匿名挂载：只指定 容器目录，Docker 会帮你自动创建。(会将容器内部自带的文件存储在默认的存放路径中 /var/lib/docker/volumes/8b3ac6b427613ce1954a427aeea8052cfaf928e625dcabe236fce1380c325995/_data) (Mounts.Name: 8b3ac6b427613ce1954a427aeea8052cfaf928e625dcabe236fce1380c325995)
$ docker run --name tomcat-3 -p 8083:8080 -d -v /usr/local/tomcat/webapps/ROOT tomcat

# 2. 指定目录挂载：直接指定一个路径作为数据卷的存放位置。(宿主机路径里边的文件内容需要自己创建) (常用) (Mounts.Source: /Users/sky/Desktop/study_github/study_docker/volume_demo/demo2)
# docker run -v 路径:容器内部的路径 镜像ID

$ docker run -d --name tomcat-2 -p 8082:8080 -v /Users/sky/Desktop/study_github/study_docker/volume_demo/demo2:/usr/local/tomcat/webapps/ROOT tomcat

# :ro 只读模式。只允许 容器内进行读取，不允许写入。
# :rw 读写模式。
$ docker run -d --name tomcat-4 -p 8084:8080 -v /Users/sky/Desktop/study_github/study_docker/volume_demo/demo2:/usr/local/tomcat/webapps/ROOT:ro tomcat

# 3. 继承数据卷
$ docker run -d --name tomcat-5 -p 8085:8080 --volumes-from tomcat-2 tomcat

# :ro 只读模式。
$ docker run -d --name tomcat-6 -p 8086:8080 --volumes-from tomcat-2:ro tomcat
```

### 备份和迁移

将容器保存为镜像

```shell
# docker commit 容器名 镜像名
$ docker commit tomcat-1 test-tomcat-i

# 基于 tomcat-1 这个容器，构建一个 test-tomcat-i 的镜像
# -a: 作者
# -m: commit 信息
$ docker commit -a="sky" -m='test tomcat demo1' tomcat-1 test-tomcat-i

# 查看刚刚保存的镜像
$ docker images;

# 基于新的镜像 创建新的容器
$ docker run --name test-tomcat-1 -d -p 8090:8080 test-tomcat-i
```

镜像备份

```shell
# test-tomcat-i: 要备份的镜像名
# test-tomcat-i.tar: 备份之后的文件名

$ docker save -o /Users/sky/Desktop/study_github/study_docker/backup_images_demo/test-tomcat-i.tar test-tomcat-i
```

镜像恢复和迁移

```shell
$ docker load -i /Users/sky/Desktop/study_github/study_docker/backup_images_demo/test-tomcat-i.tar
```

### 常见服务部署

部署 Mysql

```shell
# 1. 拉取镜像
$ docker pull mysql:8

# 2. 创建容器
$ docker run -d --name test-mysql-1 -p 3310:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:8
```

部署 Redis

```shell
# 1. 拉取镜像
$ docker pull redis

# 2. 创建容器
$ docker run -d --name test-redis-1 -p 6379:6379 redis

# 3. redis-cli 链接
$ redis-cli -h 127.0.0.1 -p 6379
```

部署 Tomcat

```shell
# 1. 拉取镜像
$ docker pull tomcat

# 2. 创建容器
$ docker run -d --name tomcat-8081 -p 8081:8080 tomcat
```

部署 Nginx

```shell
# 1. 拉取镜像
$ docker pull nginx

# 2. 创建容器
$ docker run -d --name test-nginx-1 -p 90:80 nginx

# 3. 部署静态页面到 nginx (具体上传到 nginx 的哪个目录，需要从 nginx.conf 的 include 字段: /etc/nginx/conf.d/default.conf 里的 root 对应文件夹。)
# docker exec -it test-nginx-1 bash
# whereis nginx;

$ docker cp /Users/sky/Desktop/docker-demo/usr/local/nginx/html test-nginx-1:/usr/share/nginx/
```

部署 Nginx 代理集群

```shell
# 例子: nginx_demo/demo2

# 1. 先启动一个 Nginx 服务, 要把 这两个文件 copy 下来。
$ docker cp nginx-test-1:/etc/nginx/nginx.conf /Users/sky/Desktop/study_github/study_docker/nginx_demo/demo2/usr/local/nginx/conf/
$ docker cp nginx-test-1:/etc/nginx/conf.d /Users/sky/Desktop/study_github/study_docker/nginx_demo/demo2/usr/local/nginx/conf/

# 2. 创建一个 docker 网络
$ docker network create test-nginx-tomcat-net-1

# 部署两个 tomcat 应用
$ docker run -d -p 8081:8080 --name test-tomcat-1 --network test-nginx-tomcat-net-1 -v /Users/sky/Desktop/study_github/study_docker/nginx_demo/demo2/tomcat_demo_1_html:/usr/local/tomcat/webapps/ROOT tomcat

$ docker run -d -p 8082:8080 --name test-tomcat-2 --network test-nginx-tomcat-net-1 -v /Users/sky/Desktop/study_github/study_docker/nginx_demo/demo2/tomcat_demo_2_html:/usr/local/tomcat/webapps/ROOT tomcat

# 3. 以目录挂载方式 启动 nginx 容器 (html, logs 两个文件夹需要自己创建，nginx 的配置也需要先使用上面的命令 copy 下来。)
$ docker run -d -p 82:80 --name test-nginx-2 --network test-nginx-tomcat-net-1 -v /Users/sky/Desktop/study_github/study_docker/nginx_demo/demo2/usr/local/nginx/html:/usr/share/nginx/html -v /Users/sky/Desktop/study_github/study_docker/nginx_demo/demo2/usr/local/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /Users/sky/Desktop/study_github/study_docker/nginx_demo/demo2/usr/local/nginx/conf/conf.d/default.conf:/etc/nginx/conf.d/default.conf -v /Users/sky/Desktop/study_github/study_docker/nginx_demo/demo2/usr/local/nginx/logs:/var/log/nginx nginx

# or:

$ docker run -d -p 82:80 --name test-nginx-2 --network test-nginx-tomcat-net-1 -v /Users/sky/Desktop/docker-demo/usr/local/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /Users/sky/Desktop/docker-demo/usr/local/nginx/conf/conf.d/default.conf:/etc/nginx/conf.d/default.conf nginx

# 4. 修改下列文件

# default.conf 中的第 8 行 (这行配置可以直接覆盖，或者删除写心的内容，不能保留旧内容 或者 注释旧内容。)

# location / {
#		proxy_pass http://nginxCluster;
# }

# nginx.conf 中第 31 行 添加

# upstream nginxCluster {
#		server test-tomcat-1:8080; # 容器名:内部端口
#		server test-tomcat-2:8080; # 容器名:内部端口
# }

# 5. 重启 nginx 容器服务
$ docker restart nginx-test-2

# 6. 访问: http://localhost:82/
# 可以看到 内容在 hello Nginx Demo 2 Tomcat Server... 222 和 hello Nginx Demo 2 Tomcat Server... 111 之间切换，说明代理成功。
```



## 自定义镜像

使用 Dockerfile 文件，并且指定 自定义镜像信息。

### Dockerfile

基础镜像原本有的参数，不想覆盖就不用配置，会使用基础镜像默认的。

**DockerFile 里的常用内容**

**FROM:** 指定当前自定义镜像依赖的环境

**COPY:** 将相对路径下的内容 复制到 自定义镜像中

**WORKDIR:** 声明镜像的默认工作目录

**ADD:**

**CMD:** 需要执行的命令 (在 WORKDIR 下执行的，CMD 可以写多个，但是只以最后一个为准。)

**RUN:**

**ENV:**

**MAINTAINER:**

**EXPOSE:**

```shell
# FROM image_name: tag 定义了使用哪个基础镜像启动构建流程
# MAINTAINER user_name 声明镜像的创建者
# ENV key value 设置环境变量 (可以写多条)
# RUN command 是 Dockerfile 的核心部分 (可以写多条)
# ADD source_dir/file dest_dir/file 将宿主机的文件复制到容器内，如果是一个压缩文件，将会在复制后自动解压。(ADD 源的文件夹/文件 目标的文件夹/文件)
# COPY source_dir/file dest_dir/file 和 ADD 相似，但是如果有压缩文件并不能解压 (COPY 源的文件夹/文件 目标的文件夹/文件)
# WORKDIR path_dir 设置工作目录
# EXPOSE 3000 向外暴露端口
# VOLUME source_dir/file 设置数据卷 (一般用不到)
# CMD ["npm", "run", "start"] 指定容器启动后要做的事情

# RUN git clone https://github.com/xxx 可以从 git 上拉取代码
```

构建镜像命令

```shell
# docker build -t 镜像名:版本tag .
# .: ADD/COPY 要添加的资源位置 . 代表当前目录。告诉 Docker 去哪里找 Dockerfile 和构建所需的所有文件。
# tag: 镜像的版本号 (比如 1.0.0)
# -f: Dockerfile文件路径，默认当前目录下。

# . 终极总结（最关键）
# 	1. .= 给 Docker 提供 “文件来源”
#		2. ADD = 从这个来源里复制文件到镜像里
#		3. ADD 能访问的文件，必须在 . 目录里面
#		4. ADD 里 绝对路径、上级目录（../）都不能用

$ docker build -t demo-tomcat .

$ docker build -t demo-tomcat-3:1.0

$ docker run -d -p 8100:8080 --name demo-tomcat-3-1 demo-tomcat-3:1.0

# 如果再次运行 docker build -t demo-tomcat . 就会产生一个虚悬镜像

# 例子: dockerfile_demo
```



### Docker-Compose

可以通过 Docker-compose 批量编写参数，可以批量的管理容器。

只需要创建一个 docker-compose.yml 文件去维护即可。

以下命令需要在 当前 docker-compose.yml 文件夹下执行

**一旦修改了 docker-compose.yml** 文件内容需要 stop 停止服务，然后 down 删除服务，重新 执行 **docker-compose up -d** 命令

```shell
# 1. 上线 (启动) docker-compose 里的服务 (默认会在当前目录下寻找 docker-compose.yml)
# -d: 以 后台进程 上线

$ docker-compose up -d

# docker-compose up -d 文件名.后缀名

# 或者 文件不是 docker-compose.yml 需要使用 -f 指定 文件名

$ docker-compose -f docker-compose-2.yml up -d

$ docker-compose -f docker-compose-2.yml stop

$ docker-compose -f docker-compose-2.ym down

# 2. 停止容器 里的所有服务
$ docker-compose stop

# 3. 删除容器 里的所有服务
$ docker-compose down

# 4. 启动由 docker-compose 维护的容器
$ docker-compose start

$ docker-compose restart

# 5. 查看 docker-compose 管理的容器
$ docker-compose ps

# 6. 查看 docker-compose 日志
$ docker-compose logs -f

# 例子：compose_demo
```

如何支持 12306 网站服务的 闲忙不均问题？

答：可以编写多个 docker-compose.yml 文件。A 文件支持春节，B 文件支持平时。



### Dockerfile 配合 docker-compose 一起使用

使用 **docker-compose.yml** 文件 以及 **Dockerfile** 文件在生成自定义镜像的同时 启动当前镜像，并且由 docker-compose 去管理容器。



```shell
$ docker-compose up -d
# 注意：该命令在 自定义镜像不存在时，会帮助我们构建出自定义镜像，但是如果这个自定义镜像已经存在，则会直接运行这个自定义镜像。
# 如果只是 docker-compose.yml 里边的环境变量更改，则无需 重新构建镜像，只需重启即可。

# 如果要重新构建镜像，需要使用
$ docker-compose build

# 运行前，重新构建镜像
$ docker-compose up -d --build
```

**Dockerfile** 和 **docker-compose.yml** 编写时 要注意的点

```shell
# SERVER_PORT=3003 是给你的 Node 代码用的配置，属于环境变量 -> 必须放在 docker-compose.yml 里，不要写死在 Dockerfile 中！

# 一：先搞懂 3个端口 的区别
# 	1. SERVER_PORT=3003
#			作用：你的 Node 代码自己监听的端口 (代码里读这个变量)
#			归属：环境变量 -> 放 docker-compose.yml
#		2. ports: - 3330:3003
#			作用：电脑端口 -> 映射到 -> 容器内部端口
#			归属：docker-compose.yml
#		3. Dockerfile 里的 EXPOSE
#			没用，不用写。

#	二：为什么不能放 Dockerfile
#		1. 写死不灵活。开发、测试、生产环境想换端口，必须重新构建镜像。
#		2. 违反 Docker 最佳实践。环境变量、配置 -> 都属于运行时，不属于构建时。
#		3. Dockerfile 只负责打包程序，不负责运行配置。

# 配置项									放哪里
#	时区 TZ								 docker-compose.yml
#	服务端口 SERVER_PORT	 docker-compose.yml
#	端口映射 3330:3003		 docker-compose.yml
#	数据库密码							docker-compose.yml

# Dockerfile 只打包代码，不写运行时配置。

# 例子：dockerfile-docker_compose_demo
```

### 多阶段构建镜像（例如：前端发布）

前端 + nginx 模板

```shell
# 第一阶段

# FROM node # 或者 AD basic
# COPY ./ /app
# WORKDIR /app
# RUN npm install && npm run build

# 第二阶段

# FROM nginx
# RUN mkdir /app
# COPY --from=0 /app/dist /app # from=0 表示从第一个基底对象拷贝内容
# 或者 COPY basic:/app/dist /app
# COPY nginx.conf /etc/nginx/nginx.conf

# nginx.conf 内容如下：

// user  nginx;
// worker_processes  auto;

// error_log  /var/log/nginx/error.log notice;
// pid        /run/nginx.pid;


// events {
//     worker_connections  1024;
// }


// http {
//     include       /etc/nginx/mime.types;
//     default_type  application/octet-stream;

//     log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
//                       '$status $body_bytes_sent "$http_referer" '
//                       '"$http_user_agent" "$http_x_forwarded_for"';

//     access_log  /var/log/nginx/access.log  main;

//     sendfile        on;
//     #tcp_nopush     on;

//     keepalive_timeout  65;

//     server {
//       listen       80;
//       server_name  localhost;

//       location / {
//         root  /app;
//         index index.html;
//         try_files $uri $uri/ /index.html;
//       }

//       error_page 500 502 503 504 /50x.html;
//       location = /50x.html {
//         root /usr/share/nginx/html;
//       }
//     }

//     #gzip  on;
// }
```



---























