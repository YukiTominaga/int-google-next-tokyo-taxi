# 測地系変換Dataflowパイプライン

## 概要
PubSubにストリーミングされたタクシーデータ（日本測地系）を世界測地系に変換するためのDataflowパイプライン

## デプロイ方法
```
python job.py --project={project}
              --job_name={job_name}
              --region={region}
              --staging_location={staging_location}
              --temp_location={temp_location}
              --input={input}
              --output={output}
              --runner=DataflowRunner
              --streaming
 ```

### カスタムオプション
|Option|説明|
 |---|---|
 |input|入力元のPubSubトピック(書式は'projects/{project}/topics/{topic}')|
 |output|出力先のPubSubトピック(書式はinputと同様)|
