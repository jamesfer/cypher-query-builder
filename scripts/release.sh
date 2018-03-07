#!/usr/bin/env bash

red=$'\e[1;31m'
green=$'\e[1;32m'
blue=$'\e[1;34m'
magenta=$'\e[1;35m'
cyan=$'\e[1;36m'
end=$'\e[0m'

current_version=$(node -p "require('./package.json').version")
current_branch=$(git rev-parse --abbrev-ref HEAD)

if [[ $# -lt 1 ]]; then
    printf "${red}Don't forget to specify a release type${end}\n"
    exit 1
fi

if [ "$current_branch" == "master" ]; then
  printf "${red}Cannot merge master. Switch to a feature branch and rerun this command.${end}\n"
  exit 1
fi

echo "${magenta}Merging...${end}"
git checkout master
git merge "$current_branch" --no-ff --no-commit

echo "${magenta}Bumping version...${end}"
new_version=$(npm version --no-git-tag-version $1)

git commit -am "Release version ${new_version}"
git tag -a ${new_version} -m "${new_version}"

echo "${green}${new_version}${end}"
echo "Push the new version with ${green}git push origin master --tags${end}"
