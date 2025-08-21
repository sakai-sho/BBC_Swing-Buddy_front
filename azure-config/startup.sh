#!/bin/bash

# Azure App Service用のスタートアップスクリプト
echo "=== Next.js Application Startup Script ==="
echo "Starting Next.js application..."

# 環境変数の確認と設定
if [ -z "$PORT" ]; then
    export PORT=8000
fi

if [ -z "$WEBSITES_PORT" ]; then
    export WEBSITES_PORT=8000
fi

echo "Using PORT: $PORT"
echo "Using WEBSITES_PORT: $WEBSITES_PORT"

# アプリケーションディレクトリに移動
cd /home/site/wwwroot

echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# azure-configディレクトリの存在確認
if [ ! -d "azure-config" ]; then
    echo "ERROR: azure-config directory not found"
    exit 1
fi

# startup.shの実行権限を確認
if [ ! -x "azure-config/startup.sh" ]; then
    echo "Making startup.sh executable..."
    chmod +x azure-config/startup.sh
fi

# standaloneディレクトリが存在するかチェック
if [ -d ".next/standalone" ]; then
    echo "Found standalone build, starting server..."
    cd .next/standalone
    echo "Standalone directory contents:"
    ls -la
    
    if [ -f "server.js" ]; then
        echo "Starting server.js on port $PORT..."
        echo "Server will be available at http://localhost:$PORT"
        PORT=$PORT node server.js
    else
        echo "ERROR: server.js not found in standalone directory"
        exit 1
    fi
else
    echo "Standalone build not found, attempting to build..."
    
    # 依存関係のインストール
    echo "Installing dependencies..."
    npm install
    
    # アプリケーションのビルド
    echo "Building application..."
    npm run build
    
    if [ -d ".next/standalone" ]; then
        echo "Build successful, starting server..."
        cd .next/standalone
        echo "Starting server.js on port $PORT..."
        echo "Server will be available at http://localhost:$PORT"
        PORT=$PORT node server.js
    else
        echo "ERROR: Build failed or standalone directory not created"
        echo "Build directory contents:"
        ls -la .next/
        exit 1
    fi
fi