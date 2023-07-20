#!/bin/bash

docker volume create mongodb-db
docker volume create mongodb-configdb


echo "Volumes created"
echo "Run: docker-compose up -d"