#!/bin/bash

# Azure App Service用のスタートアップスクリプト
echo "Starting Next.js application..."

# 環境変数が設定されていない場合のデフォルト値
if [ -z "$PORT" ]; then
    export PORT=8080
fi

# アプリケーションディレクトリに移動
cd /home/site/wwwroot

# ビルドディレクトリが存在するかチェック
if [ ! -d ".next" ]; then
    echo "Building application..."
    npm install
    npm run build
fi

# standaloneディレクトリが存在するかチェック
if [ -d ".next/standalone" ]; then
    echo "Starting from standalone build..."
    cd .next/standalone
    node server.js
else
    echo "Starting from regular build..."
    npm start
fi
