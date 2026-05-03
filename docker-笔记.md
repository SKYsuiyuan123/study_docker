## Docker 镜像和容器

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





## 自定义镜像
