# umi project

## Getting Started

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```

test update lowercase

- 风险等级定义：
  1 -> 一级风险
  2 -> 二级风险
  3 -> 三级风险
  0 -> 无风险

<!-- 64.31部署脚本 -->

地址：
ssh root@10.0.64.31

<!-- 脚本 -->

docker rm -f ca-watershed-fe || true &&
docker image prune -a -f || true &&
docker login -u admin -p yskj2407 1.117.192.82:8666 &&
docker run -itd -p 80:8051 -v /opt/ca-watershed/front/nginx.conf:/etc/nginx/nginx.conf -v /opt/ca-watershed/front/fe.conf:/etc/nginx/conf.d/default.conf --restart=always --name ca-watershed-fe 1.117.192.82:8666/ca-watershed/ca-watershed-fe:v3.2.35

cawatershed
yskJ24o7@gw
