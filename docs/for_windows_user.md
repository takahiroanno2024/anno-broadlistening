## Windowsユーザ向けDockerセットアップ
(注: このドキュメントは作りかけです)


WindowsユーザはMacやLinuxと比較して環境構築で迷いやすいです。Dockerを使用して比較的マシに環境をセットアップできます。以下の手順に従ってください。

### 1. **Dockerのインストール**
Docker Desktopをインストールし、起動します。

### 2. **環境変数の設定**
プロジェクトのルートディレクトリで`.env`ファイルを作成します。`.env.example`ファイルをコピーして編集すると良いでしょう。
以下のような内容になります。

```
OPENAI_API_KEY=<your_openai_api_key_here>
```

### 3. **Dockerイメージのビルド**
プロジェクトのルートディレクトリで以下のコマンドを実行してDockerイメージをビルドします。

```bash
docker build -t broadlistening .
```

### 3. **Dockerコンテナの起動**
以下のコマンドを実行してDockerコンテナを起動し、レポートを生成します。

```bash
docker run -p 8000:8000 broadlistening
```


### 4. 結果の確認
ブラウザで`http://localhost:8000`を開き、生成されたレポートを確認します。
