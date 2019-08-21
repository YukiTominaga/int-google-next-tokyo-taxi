## Deploy
※ You need to install Google Cloud SDK
If you have not install SDK, Please install via [Here](https://cloud.google.com/sdk/install)

You need to install gcloud component [beta](https://cloud.google.com/sdk/gcloud/reference/beta/?hl=en)
```
$gcloud components install beta
```
Authenticate with your current Google Account
```
$gcloud auth login
```
Set your GCP Project to deploy function
```
$gcloud config set project {YOUR_PROJECT_ID}
```
Deploy your function(Please specify pub/sub topic name for subscribe)
```
$gcloud beta functions deploy subscribe --region us-central1 --runtime python37 --trigger-resource {YOUR_TOPIC_NAME} --trigger-event google.pubsub.topic.publish --memory 1024MB --timeout 540s
```