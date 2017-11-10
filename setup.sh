#! /bin/bash

DOCKER_COMPOSE_COMMAND=`which docker-compose`

if [ ! -x $DOCKER_COMPOSE_COMMAND ]; then
  echo "error, should install docker-compose" >&2
  exit -1
fi

REPOSITORY_DIR=$(pwd)

cd $REPOSITORY_DIR/api && make build

docker-compose up -d