#!/bin/bash

# Azure App Service用のデプロイスクリプト
echo "Deploying Next.js application to Azure App Service..."

# 依存関係をインストール
npm install

# アプリケーションをビルド
npm run build

# ビルドが成功したかチェック
if [ $? -eq 0 ]; then
    echo "Build successful!"
else
    echo "Build failed!"
    exit 1
fi

echo "Deployment completed successfully!"
