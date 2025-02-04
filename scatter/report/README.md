# broardlistening-report

ブロードリスニングのレポートを表示します

## About
- 階層型クラスタリングの出力 (`hierarchical_result.json`) に対応したレポートです
- 従来の TTTC の出力 (`result.json`) には対応していません

## Install
```
npm install
```

## Environment variables
- 環境変数 (`process.env.REPORT`) に対象となる出力名を指定してください
- 出力名一覧は `../pipeline/outputs/{{output_name}}` を確認してください

## Develop
```
REPORT=output_name npm run dev
```
開発中は修正内容が即時反映されます

## Build
```
REPORT=output_name npm run build
```
ビルド実行時の出力先は `../pipeline/outputs/{{output_name}}/report` です

## Start
```
REPORT=output_name npm start
```
通常は `https://localhost:3000/` が起動して結果を確認できます

## Metadata

- 任意でレポート作成者の情報を埋め込めます(無くても出力は可能です)
- レポート作成者の情報を埋め込むには `../pipeline/outputs/{{output_name}}` に以下のファイルを配置してください

```
- reporter.png
  - レポート作成者のロゴ画像

- metadata.json
  - reporterName: レポート作成者名
  - projectMessage: プロジェクトについての説明
  - projectLink: プロジェクトページのリンク(省略可)
  - privacyLink: プライバシーポリシーのリンク(省略可)
  - termsLink: 利用規約のリンク(省略可)
```
