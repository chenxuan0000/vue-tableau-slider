#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd ./public

git init
git add -A
git commit -m 'deploy's

# 如果发布到 https://chenxuan0000.github.io/vue-tableau-slider
git push -f https://github.com/chenxuan0000/vue-tableau-slider master:gh-pages

cd -