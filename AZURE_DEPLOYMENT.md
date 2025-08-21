# Azure App Service へのデプロイ手順

## 概要
このドキュメントでは、Next.jsアプリケーションをAzure App Serviceにデプロイする手順を説明します。

## 前提条件
- Azure CLIがインストールされている
- Azure App Serviceプランが作成されている
- Node.js 20.x以上がサポートされている

## デプロイ手順

### 1. アプリケーションのビルド
```bash
npm install
npm run build
```

### 2. Azure App Serviceの作成（初回のみ）
```bash
# リソースグループの作成
az group create --name your-resource-group --location japaneast

# App Serviceプランの作成
az appservice plan create --name your-app-service-plan --resource-group your-resource-group --sku B1 --is-linux

# Webアプリの作成
az webapp create --resource-group your-resource-group --plan your-app-service-plan --name your-app-name --runtime "NODE|20-lts"
```

### 3. 環境変数の設定
Azure App Serviceの設定で以下の環境変数を設定してください：
- `NODE_ENV`: `production`
- `PORT`: `8080`
- `NEXT_TELEMETRY_DISABLED`: `1`

### 4. デプロイ
```bash
# ローカルからデプロイ
az webapp up --name your-app-name --resource-group your-resource-group --runtime "NODE|20-lts"

# または、GitHub Actionsを使用
# .github/workflows/deploy.yml を参照
```

### 5. アプリケーションの起動確認
```bash
az webapp browse --name your-app-name --resource-group your-resource-group
```

## トラブルシューティング

### よくあるエラー

#### "next: not found" エラー
- `next.config.js`で`output: 'standalone'`が設定されていることを確認
- `package.json`のstartスクリプトが`node server.js`になっていることを確認

#### ポート設定エラー
- 環境変数`PORT`が正しく設定されていることを確認
- Azure App Serviceの設定でポートが開放されていることを確認

#### ビルドエラー
- Node.jsのバージョンが20.x以上であることを確認
- 依存関係が正しくインストールされていることを確認

## 設定ファイル

### next.config.js
```javascript
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  output: 'standalone'
}
```

### package.json
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

## サポート
問題が発生した場合は、Azure App Serviceのログを確認してください：
```bash
az webapp log tail --name your-app-name --resource-group your-resource-group
```
