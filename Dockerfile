# syntax=docker/dockerfile:1
# ベースイメージとしてPythonを含むイメージを使用
FROM python:3.10-slim AS builder

# 作業ディレクトリを設定
WORKDIR /app

# 必要なシステムパッケージをインストール
RUN --mount=type=cache,target=/var/lib/apt \
    --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y --no-install-recommends curl gcc build-essential && rm -rf /var/lib/apt/lists/*

# uv（Rust製のPythonパッケージマネージャー）のインストール
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 依存関係管理ファイル（pyproject.toml と uv.lock）をコピー
COPY pyproject.toml uv.lock ./

# システムの Python 環境に依存関係をインストールするための設定
ENV UV_PROJECT_ENVIRONMENT=/usr/local

# システムの Python にインストール
RUN uv sync --locked

# 残りの全てのソースコードをコピー
COPY . .

ENV NLTK_DATA=/app/nltk_data

# NLTKのデータをダウンロード
RUN python -c "import nltk; nltk.download('stopwords', download_dir='/app/nltk_data')"

# 実行用イメージを作成
FROM python:3.10-slim AS runner

WORKDIR /app

# 非rootユーザーを作成
RUN groupadd --system appuser && useradd --system --gid appuser appuser

# Builder ステージから必要なファイルをコピー
COPY --from=builder /app /app

# ビルダーでインストールされたPythonパッケージをコピー
COPY --from=builder /usr/local/lib/python3.10 /usr/local/lib/python3.10

# curl と Node.js をインストール
RUN --mount=type=cache,target=/var/lib/apt \
    --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y --no-install-recommends curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get update && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# 依存関係をインストール
RUN --mount=type=cache,target=/root/.npm npm ci --prefix scatter/next-app

# 作業ディレクトリの所有権を調整
RUN chown -R appuser:appuser /app
USER appuser

# 実行ポート
EXPOSE 8000

# パイプラインを実行し、レポートを生成
CMD ["bash", "-c", "cd scatter/pipeline && python main.py configs/example-polis.json --skip-interaction && cd outputs/example-polis/report && python -m http.server 8000"]
