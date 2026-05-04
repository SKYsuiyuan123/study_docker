
使用 nginx 部署 代理 一个 tomcat 集群，部署成功后访问 http://localhost:82/ 这个服务，可以看到内容在 tomcat_demo_1_html 和 tomcat_demo_2_html 直接来回切换。

### 部署 Nginx 代理集群 步骤

```shell
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
