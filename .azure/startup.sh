#!/bin/bash

# Azure App Service用のスタートアップスクリプト
echo "Starting Next.js application..."

# 環境変数が設定されていない場合のデフォルト値
if [ -z "$PORT" ]; then
    export PORT=8080
fi

# Next.jsアプリケーションを起動
cd /home/site/wwwroot
npm start
