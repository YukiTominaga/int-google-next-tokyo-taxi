# next-tokyo-taxi
Next Tokyo Taxi Demo のデモ環境を新規に作成するための手順とかを書く。

## pulumi
```
$ pulumi stack init <YOUR_PROJECT_ID>
```
`Pulumi.<YOUR_PROJECT_ID>.yaml` というファイルを作成し、中身を以下のようにする。
```
config:
  gcp:project: <YOUR_PROJECT_ID>
```
### GCPに環境構築
```
$ pulumi up
```
これでいけるはず。
APIが有効化されていない系エラーが出たら申し訳ありませんが適宜手動で有効化してください。

## タクシーエミュレーター
タクシーの動きをエミュレートするDockerコンテナのビルド方法
```
$ cd mock
$ gcloud builds submit --config=cloudbuild.yaml --project=<YOUR_PROJECT_ID>
```

## Angularアプリケーション
### API KEYの発行
Maps Javascript APIのためのAPI KEYを発行する。
GCPのいつものやつなので手順は省略する。
念の為Maps APIだけに制限をかけたりすると良いのかもしれない。

### API KEYの書き換え
[cloudbuild.yaml](/angular/cloudbuild.yaml)の以下の部分を発行したAPI KEYに書き換える
```
substitutions:
  _APIKEY: YOUR_API_KEY # Fixme
```

### Firebaseの初期化
Firebaseコンソールにプロジェクトを追加してください(手順略)。
もしかしたらFirebaseは使う必要がないのかもしれないとは思っている。
でもAngularFireがGCPのFirestoreでうまく動くのかどうか検証するのが後回しになっている。
下記のような認証情報を[environment.prod.ts](/angular/src/environments/environment.prod.ts)に書き換える。
```
const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "ca-tominaga-gihyou.firebaseapp.com",
  databaseURL: "https://ca-tominaga-gihyou.firebaseio.com",
  projectId: "ca-tominaga-gihyou",
  storageBucket: "ca-tominaga-gihyou.appspot.com",
  messagingSenderId: "801597055938",
  appId: "1:801597055938:web:2daeeee94e068e63"
};
```
### Angularのビルド
```
$ ng build --prod
```

### FirebaseHostingへのデプロイ
```
$ ca angular
$ firebase init
? Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter to confirm your choices. 
 ◯ Database: Deploy Firebase Realtime Database Rules
 ◉ Firestore: Deploy rules and create indexes for Firestore
 ◯ Functions: Configure and deploy Cloud Functions
❯◉ Hosting: Configure and deploy Firebase Hosting sites
 ◯ Storage: Deploy Cloud Storage security rules
? What file should be used for Firestore Rules? firestore.rules
? File firestore.rules already exists. Do you want to overwrite it with the Firestore Rules from the Firebase Console? Yes
? What do you want to use as your public directory? dist
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
```

```
$ firebase deploy -P YOUR_PROJECT_ID --only hosting -p dist/next-tokyo-taxi
$ firebase deploy -P YOUR_PROJECT_ID --only firestore
```

### TIPS
- Firebase AuthでGoogleアカウントのログインを有効化する
- Firestoreのセキュリティルール気をつける
- OAuth consent screen を設定する

# Known Issue
- pulumiでIAM APIを有効化できない