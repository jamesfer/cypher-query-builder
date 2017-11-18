#!/usr/bin/env bash

red=$'\e[1;31m'
green=$'\e[1;32m'
blue=$'\e[1;34m'
magenta=$'\e[1;35m'
cyan=$'\e[1;36m'
end=$'\e[0m'

current_version=$(node -p "require('./package.json').version")

if [[ $# -lt 1 ]]; then
    printf "${red}Don't forget to specify a release type${end}\n\n"
    exit 1
fi

echo "${magenta}Merging...${end}"
git checkout master
git merge develop --no-ff --no-commit

echo "${magenta}Bumping version...${end}"
new_version=$(npm version --no-git-tag-version $1)
echo "${green}${new_version}${end}"

git commit -am "Release version ${new_version}"
git tag -a ${new_version} -m "${new_version}"
