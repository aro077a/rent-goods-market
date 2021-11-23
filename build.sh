#!/usr/bin/env bash

if [ -z $1 ]; then
    echo "./build.sh [env]"
    exit 0
fi

TARGET_ENV=$1 npm run build-prod
