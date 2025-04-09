#!/usr/bin/env bash

NGINX_CONF_PATH="./utils/nginx/nginx.conf"

docker run --rm -p 8080:8080 \
  --network backend \
  -v $NGINX_CONF_PATH:/etc/nginx/nginx.conf:ro \
  nginx
