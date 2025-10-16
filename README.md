# Google Classroom Hide Author

Google Classroom の投稿者名・年度・ワークシート名を自動的に非表示にするブラウザ拡張機能です。

## 主な機能

-   **投稿者名の非表示**: 「〇〇さんが〜」という投稿者名を自動で非表示
-   **年度表記の削除**: 「2025 年*」「2025*」「2025＿」などの年度表記を自動で除去
-   **ワークシート名の削除**: 「\_ワークシート」「ワークシート」を自動で除去
-   **柔軟な文字対応**: 半角・全角アンダースコアやスペースにも対応

## 対応ブラウザ

-   Google Chrome / Chromium 系ブラウザ
-   Mozilla Firefox

## インストール方法

### Chrome

1. [Releases](https://github.com/Narcissus-tazetta/Google-Classroom-Hide-Author/releases)から最新の`chrome.zip`をダウンロード
2. 解凍してフォルダを任意の場所に配置
3. Chrome で`chrome://extensions/`を開く
4. 右上の「デベロッパーモード」を有効化
5. 「パッケージ化されていない拡張機能を読み込む」をクリック
6. 解凍したフォルダを選択

### Firefox

1. [Releases](https://github.com/Narcissus-tazetta/Google-Classroom-Hide-Author/releases)から最新の`.xpi`ファイルをダウンロード
2. Firefox で`about:addons`を開く
3. 歯車アイコンをクリックし、「ファイルからアドオンをインストール」を選択
4. ダウンロードした`.xpi`ファイルを選択

## 開発者向け

### ビルド方法

```bash
# 依存パッケージのインストール
npm install

# Chrome・Firefox両方をビルド
npm run build

# Chrome版のみビルド
npm run build:chrome

# Firefox版のみビルド
npm run build:firefox

# TypeScriptの監視モード
npm run watch
```

ビルド後のファイルは`build/chrome`と`build/firefox`に生成されます。また、各ブラウザ用の zip ファイルも`build/`ディレクトリに作成されます。

### ローカルでのテスト方法

#### Chrome

1. `bun run build:chrome`を実行
2. Chrome で`chrome://extensions/`を開く
3. 「デベロッパーモード」を有効化
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. `build/chrome`フォルダを選択

#### Firefox

1. `bun run build:firefox`を実行
2. Firefox で`about:debugging#/runtime/this-firefox`を開く
3. 「一時的なアドオンを読み込む」をクリック
4. `build/firefox/manifest.json`を選択

### プロジェクト構造

```
classroom/
├── src/
│   └── content.ts          # メインのコンテンツスクリプト
├── scripts/
│   ├── build-chrome.js     # Chromeビルドスクリプト
│   └── build-firefox.js    # Firefoxビルドスクリプト
├── manifest.chrome.json    # Chrome用マニフェスト
├── manifest.firefox.json   # Firefox用マニフェスト
├── package.json
└── tsconfig.json
```

## 使い方

インストール後、Google Classroom のページを開くだけで自動的に動作します。特別な設定は不要です。

## 注意事項

-   本拡張は Google Classroom の UI 変更により動作しなくなる可能性があります
-   不具合や改善要望は[Issues](https://github.com/Narcissus-tazetta/Google-Classroom-Hide-Author/issues)からご報告ください

## ライセンス

[LICENSE](LICENSE)を参照してください。

## この文章は AI が生成しました

## 変更履歴

### v1.0.0 (2025-10-15)

-   初回リリース
-   TypeScript 化、Chrome/Firefox 両対応
-   投稿者名・年度・ワークシート名の自動削除機能
