# Classroom Polish

Google Classroom の UI に対して以下の改善・補助を行うブラウザ拡張です。

主な機能:

-   投稿者名・冗長表記の簡潔化（「〇〇さんが〜」を要約表示）
-   Classroom のトピック / ドロップダウンに検索フィルタを追加（日本語/ローマ字対応の部分一致）
-   カスタム読み辞書で漢字語句を任意の読み（ひらがな）にマッピングして検索精度を向上

対応ブラウザ: Chrome/Chromium 系、Firefox

---

##　この文章は AI が書きました

## 主な機能

-   **投稿者名の非表示**: 「〇〇さんが〜」という投稿者名を自動で非表示
-   **年度表記の削除**: 「2025 年*」「2025*」「2025＿」などの年度表記を自動で除去
-   **ワークシート名の削除**: 「\_ワークシート」「ワークシート」を自動で除去

## 開発／ビルド

このリポジトリは Bun / TypeScript / esbuild ベースでビルドします。ローカルでのビルド手順:

```bash
# 依存インストール
bun install

# Chrome 用ビルド（content script をバンドルして build/chrome に出力）
bun run build:chrome

# Firefox 用ビルド
bun run build:firefox

# 変更を監視しながらビルド（必要に応じて）
bun run watch
```

ビルド後の成果物は `build/chrome` / `build/firefox` に作成されます。

---

## 開発者向けファイル構成（主要部分のみ）

```
src/
├── content.ts                    # エントリポイント（各モジュールを起動）
├── ClassroomTextProcessor.ts     # 投稿テキストの整形（投稿者名の要約化）
├── DropdownSearchEnhancer.ts     # ドロップダウン検索の実装（フィルタ挿入）
├── reading-dictionary.ts         # 漢字→読み（ひらがな）カスタム辞書
├── constants.ts                  # セレクタや定数
└── types.ts                      # 型定義
```

### 主要ポイント

-   ドロップダウン検索は `DropdownSearchEnhancer` が DOM を監視して開いたドロップダウン（オーバーレイ型）にのみ検索ボックスを挿入します。
-   漢字 → 読みは軽量な `reading-dictionary.ts`（手動マッピング）で補い、wanakana を使ってひらがな ↔ ローマ字の変換と検索バリアント生成を行っています。

---

## 使い方（ローカルでのテスト）

1. `bun run build:chrome` を実行
2. Chrome を開き `chrome://extensions/` を開く
3. 「デベロッパーモード」を有効化して `build/chrome` を読み込む

Firefox のローカルテストは `bun run build:firefox` の出力を一時アドオンとして読み込んでください。

---

## 読み辞書の編集方法

簡単なキー → 読み（ひらがな）のマッピングを `src/reading-dictionary.ts` に記載しています。例:

```ts
export const readingDictionary = {
    進路授業: "しんろじゅぎょう",
    学問入門講座: "がくもんにゅうもんこうざ",
};
```

辞書を追加・編集したらビルドして拡張を再読み込みしてください。小規模な単語集で実用性を担保する設計です（大型の形態素解析ライブラリはブラウザでは重く互換性の問題が出やすいため採用していません）。

---

## 注意事項

-   Google Classroom の DOM / クラス名は予告なく変わるため、将来的に動作が外れる可能性があります。
-   `reading-dictionary.ts` を編集すれば特定の漢字語句に対して確実に検索結果を出すようにできます。

---

## ライセンス

LICENSE を参照してください。
