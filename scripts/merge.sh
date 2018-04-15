#!/usr/bin/env bash

red=$'\e[1;31m'
green=$'\e[1;32m'
blue=$'\e[1;34m'
magenta=$'\e[1;35m'
cyan=$'\e[1;36m'
end=$'\e[0m'

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$current_branch" == "master" ]; then
  printf "${red}Cannot merge master. Switch to a feature branch and rerun this command.${end}\n"
  exit 1
fi

yarn validate

echo "${magenta}Merging...${end}"
git checkout master
git merge "$current_branch" --no-ff
