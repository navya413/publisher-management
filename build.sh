#!/bin/sh

echo $1
environment=$1
echo environment
echo $JOVEO_ENV
## cleanup
docker run --privileged --rm -v `pwd`:/src alpine sh -c "rm -rf /src/node_modules /src/dist"

# Create builder image
docker build -t pubmato-builder -f .docker/Dockerfile-builder .
if [ $? -ne 0 ];then
    exit 1
fi

# Run the builder image
docker run -e JOVEO_ENV=$JOVEO_ENV --rm -v `pwd`:/src pubmato-builder:latest
if [ $? -ne 0 ];then
    exit 2
fi

# Build the deployable image
docker build --build-arg env=$environment -t joveo/pubmato -f .docker/Dockerfile .
if [ $? -ne 0 ];then
    exit 3
fi

# remove the builder image
docker rmi -f pubmato-builder
if [ $? -ne 0 ];then
    exit 4
fi

## cleanup
docker run --privileged --rm -v `pwd`:/src alpine sh -c "rm -rf /src/node_modules /src/dist"
