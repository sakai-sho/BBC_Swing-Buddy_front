#!/bin/bash

# Azure App Service用のスタートアップスクリプト
echo "Starting Next.js application..."

# 環境変数が設定されていない場合のデフォルト値
if [ -z "$PORT" ]; then
    export PORT=8080
fi

echo "Using PORT: $PORT"

# アプリケーションディレクトリに移動
cd /home/site/wwwroot

echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# standaloneディレクトリが存在するかチェック
if [ -d ".next/standalone" ]; then
    echo "Found standalone build, starting server..."
    cd .next/standalone
    echo "Standalone directory contents:"
    ls -la
    
    if [ -f "server.js" ]; then
        echo "Starting server.js..."
        PORT=$PORT node server.js
    else
        echo "server.js not found in standalone directory"
        exit 1
    fi
else
    echo "Standalone build not found, attempting to build..."
    npm install
    npm run build
    
    if [ -d ".next/standalone" ]; then
        echo "Build successful, starting server..."
        cd .next/standalone
        PORT=$PORT node server.js
    else
        echo "Build failed or standalone directory not created"
        exit 1
    fi
fi
