# FROM nginx

# COPY ./dist  /usr/share/nginx/html
# COPY ./src/config/nginx.conf   /etc/nginx

# EXPOSE 80
# FROM node:14-slim AS builder
FROM 1.117.192.82:8666/library/node:14-slim AS builder
RUN yarn config set registry http://10.0.1.66:4873/

WORKDIR /workspace
ADD . .
COPY yarn.lock /temp/package.json
RUN yarn --frozen-lockfile
RUN yarn build

FROM hub.c.163.com/library/nginx:stable-alpine
COPY --from=builder /workspace/dist /dist
# COPY ./nginx/nginx.conf /etc/nginx
# COPY ./nginx/fe.conf /etc/nginx/conf.d/default.conf

EXPOSE 8051