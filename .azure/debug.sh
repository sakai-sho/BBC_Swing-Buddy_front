#!/bin/bash

# Azure App Service用のデバッグスクリプト
echo "=== Debug Information ==="

# 環境変数の確認
echo "Environment Variables:"
echo "PORT: $PORT"
echo "WEBSITES_PORT: $WEBSITES_PORT"
echo "NODE_ENV: $NODE_ENV"
echo "PWD: $PWD"

# ディレクトリ構造の確認
echo ""
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# .azureディレクトリの確認
echo ""
echo ".azure directory contents:"
if [ -d ".azure" ]; then
    ls -la .azure/
else
    echo ".azure directory not found"
fi

# .nextディレクトリの確認
echo ""
echo ".next directory contents:"
if [ -d ".next" ]; then
    ls -la .next/
    
    if [ -d ".next/standalone" ]; then
        echo ""
        echo ".next/standalone directory contents:"
        ls -la .next/standalone/
    else
        echo ".next/standalone directory not found"
    fi
else
    echo ".next directory not found"
fi

# package.jsonの確認
echo ""
echo "package.json contents:"
if [ -f "package.json" ]; then
    cat package.json
else
    echo "package.json not found"
fi

# Node.jsとnpmのバージョン確認
echo ""
echo "Node.js version:"
node --version
echo "npm version:"
npm --version

echo ""
echo "=== Debug Information End ==="
