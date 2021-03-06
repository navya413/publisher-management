#!/bin/sh

JOVEO_ENV=$1
echo $JOVEO_ENV
## cleanup
docker run --privileged --rm -v `pwd`:/src alpine sh -c "rm -rf /src/node_modules /src/dist"

# Create builder image
docker build --build-arg JOVEO_ENV=$JOVEO_ENV -t pubmato-builder -f .docker/Dockerfile-builder .
if [ $? -ne 0 ];then
    exit 1
fi

# Run the builder image
echo "running docker image with env $JOVEO_ENV"
docker run -e JOVEO_ENV=$JOVEO_ENV --rm -v `pwd`:/src pubmato-builder:latest
if [ $? -ne 0 ];then
    echo "exit status 2"
    exit 2
fi


# Copy to nginx.conf from nginx-$VERSION.conf
cp .docker/nginx-$JOVEO_ENV.conf .docker/nginx.conf

# Build the deployable image
echo "deploying image with env $JOVEO_ENV"
docker build -t joveo/pubmato -f .docker/Dockerfile .

if [ $? -ne 0 ];then
    echo "exit status is 3"
    exit 3
fi

# remove the builder image
docker rmi -f pubmato-builder
if [ $? -ne 0 ];then
    exit 4
fi

## cleanup
docker run --privileged --rm -v `pwd`:/src alpine sh -c "rm -rf /src/node_modules /src/dist"
