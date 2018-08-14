## デプロイ手順
※ Google Cloud SDKは既にインストールされている前提です。
インストールがまだの方は[こちら](https://cloud.google.com/sdk/install)

Cloud Functionsのデプロイは現状betaなので別途インストールする
```
$gcloud components install beta
```
現在ログインしているアカウントで認証します
```
$gcloud auth login
```
functionのデプロイ先のプロジェクトを設定します
```
$gcloud config set project {YOUR_PROJECT_ID}
```
functionをデプロイします(今回はPub/Subをトリガーに関数を実行するのでSubscribeするトピックを指定)
```
$gcloud beta functions deploy subscribe --region asia-northeast1 --runtime python37 --trigger-resource {YOUR_TOPIC_NAME} --trigger-event google.pubsub.topic.publish
```