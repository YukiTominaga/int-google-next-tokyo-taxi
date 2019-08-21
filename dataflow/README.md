# 測地系変換/乗降データ抽出 Dataflow

## 概要

### 測地系変換(job.py)
PubSubにストリーミングされたタクシーデータ（日本測地系）を世界測地系に変換してPubSubにWriteする

### 乗降データ抽出(extract_status_change.py)
PubSubにストリーミングされたタクシーデータ（日本測地系）を世界測地系に変換し、ステータスの変化があった場合はステータスのFromとToをタクシーデータに追記してPubSubにWriteする

## デプロイ方法(共通)
```
python job.py --project={project}
              --region={region}
              --staging_location={staging_location}
              --temp_location={temp_location}
              --input={input}
              --output={output}
              --runner=DataflowRunner
              --streaming
 ```
## コマンド例
python job.py --project=yutah-next-tokyo-taxi-dev --staging_location=gs://yutah-next-tokyo-taxi-dev.appspot.com/stg --temp_location=gs://yutah-next-tokyo-taxi-de v.appspot.com/tmp --input=projects/yutah-next-tokyo-taxi-dev/topics/jptx-upstream --output=projects/yutah-next-tokyo-taxi-dev/topics/tachibana-devnull --runner=DataflowRunner --streaming

### カスタムオプション
|Option|説明|
 |---|---|
 |input|入力元のPubSubトピック(書式は'projects/{project}/topics/{topic}')|
 |output|出力先のPubSubトピック(書式はinputと同様)|
