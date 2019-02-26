# モック環境構築手順

## Disclaimer

TBD

## 動作確認環境

- MacOS 10.14.2
- java 1.8.0_181

## GCP環境構築手順

TBD

## サンプルデータ投入手順

TBD

## 事前準備

emulatorを動作させる前に必要な手順を以下に示します。

### サービスアカウントのjsonキーへのパスを設定します。

```bash
$export GOOGLE_APPLICATION_CREDENTIALS={SERVICE_ACCOUNT_JSON_KEY_PATH}
```

### GCPのプロジェクトIdを設定します。

```bash
$export PUBSUB_PROJECT_ID={GCP_PROJECT_ID}
```

### Pub/Subのtopic名を設定します。

```bash
$export PUBSUB_TOPIC_NAME={PUBSUB_TOPIC_NAME}
```

### BigQueryのデータセット名を設定します。

```bash
$export BQ_DATASET_NAME={BQ_DATASET_NAME}
```

### BigQueryのテーブル名を設定します。

```bash
$export BQ_TABLE_NAME={BQ_TABLE_NAME}
```

## ローカルでの実行手順

```bash
$./gradlew build
```

```bash
$./gradlew run
```
