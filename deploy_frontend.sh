echo "start build"

yarn run build

echo "build finish"


echo "Build, Push and Run Frontend docker image"



export version="v0.1"

# docker login -u admin -p yskj2407  1.117.192.82:8666
# export version=`date "%H:%M:%S"`
docker build -t 1.117.192.82:8666/kf-fe/kf-fe:$version .
docker push 1.117.192.82:8666/kf-fe/kf-fe:$version
# docker stop hgt-fe || true
# docker rm hgt-fe || true
# docker image rm -f harbor.michaelapp.com/hgt-fe/hgt-fe:$version || true
# docker run -p 8896:80 --name hgt-fe -itd harbor.michaelapp.com/hgt-fe/hgt-fe:$version
# docker system prune -f 删除所有无用镜像
ssh root@10.0.201.191 "docker pull 1.117.192.82:8666/kf-fe/kf-fe:${version} && docker rm -f kf-fe && docker run -p 8083:80 --name kf-fe -d 1.117.192.82:8666/kf-fe/kf-fe:${version}"
