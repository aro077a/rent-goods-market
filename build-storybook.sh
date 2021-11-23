#!/usr/bin/env bash

if [ -z "$1" ]; then
    echo "./build-storybook.sh [env]"
    exit 0
fi

TARGET_ENV=$1 npm run build-storybook -- -o ./www-storybook
