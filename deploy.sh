#!/bin/sh
echo $JOVEO_ENV
awsTag="$1"
image="$2"
env="$3"

containerName=`echo "$image" | sed 's/^.*\///' | sed 's/:.*$//'`

instanceFilter='[{"Name":"tag-key","Values":["'"$awsTag"'"]},{"Name":"instance-state-name","Values":["running"]}]'

for ip in `aws ec2 describe-instances --region us-east-1 --filter "$instanceFilter" | egrep -i 'privateipaddress"' | sed 's/^.*://' | sed 's/\"//g' | sed 's/,//' | uniq`
do

    docker -H $ip:5555 pull "$image:$env"

    containerId=`docker -H $ip:5555 ps -qa --filter "name=$containerName"`
    if [ -n "$containerId" ]
    then
        echo "Stopping and removing existing container"
        docker -H $ip:5555 stop $containerName
        docker -H $ip:5555 rm $containerName
    fi

    docker -H $ip:5555 run -d -e JOVEO_ENV=$env --name $containerName --net "host" --restart=always "$image:$env"
done