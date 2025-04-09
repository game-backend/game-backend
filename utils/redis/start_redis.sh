#!/usr/bin/env bash

docker run --name game-backend-redis -p 6379:6379 -d redis:latest
