# Ultra-light Git Start

This package excludes `public/` and all build/deps to keep size minimal.
Restore assets locally under `public/` or host them (S3/CDN) and reference by URL.

```bash
git init
git add .
git commit -m "chore: initial commit (ultra-light)"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main

cp .env.example .env.local
```
