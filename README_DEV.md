# 開発向けセットアップ / ローカルサーバ

このプロジェクトは基本的に静的 HTML ファイルで動きますが、ローカルでランキングなどの永続化を試すための軽量バックエンド（Express + SQLite）を同梱しました。すべて無料ツールで動きます。

前提: Node.js (推奨: 16.x 以上) と npm がインストールされていること。

Windows (PowerShell) での素早いセットアップ:

```powershell
# 1. 依存インストール
npm install

# 2. DB 初期化（data/leaderboard.db を作成）
npm run init-db

# 3. 開発サーバ起動（静的ファイルと API を公開）
npm run dev

# ブラウザで http://localhost:3000/game9.html を開く
```

API (簡易)

- GET /api/leaderboard?limit=10
- POST /api/leaderboard  { name: string, score: number }

推奨無料ツール（編集・アセット作成）

- エディタ: VSCode
- ローカル静的サーバ: Live Server (VSCode 拡張) または `npx serve`
- 画像/ドット絵: Piskel (web), GIMP, Krita
- 2D アイコン / ベクタ: Inkscape
- 音声: Audacity

ホスティングや運用で外部 DB が欲しい場合（無料枠）

- Supabase：オープンソースで Firebase 互換、無料枠あり
- Firebase：簡単に認証や Firestore を使える（無料枠は小さい）
