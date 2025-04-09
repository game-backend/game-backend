#!/usr/bin/env bash

docker run -d \
  --name mongo-local \
  -p 27017:27017 \
  -v ./utils/db/mongodb_data:/data/db \
  -v ./utils/db/mongod.conf:/etc/mongod.conf \
  -e MONGO_INITDB_ROOT_USERNAME=app \
  -e MONGO_INITDB_ROOT_PASSWORD=1234 \
  mongo \
  mongod --config /etc/mongod.conf --auth

