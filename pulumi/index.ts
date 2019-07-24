import * as pulumi from "@pulumi/pulumi";
import * as gcp    from "@pulumi/gcp";

import { AppEngine }        from './components/AppEngine';
import { BigQueryDataset }  from './components/BigQueryDataset';
import { BigQueryTable }    from './components/BigQueryTable';
import { PubSub }           from './components/PubSub';
import { ServiceAccount }   from './components/ServiceAccount';
import { ProjectIAMMember } from './components/ProjectIAMMember';

/* 指定したprojectIdを取る時
 * new pulumi.Config("gcp").get("project")
 */

const config = new pulumi.Config("gcp");
const projectId = config.get("project") as string;

// AppEngine
const appengine = new AppEngine("next-tokyo-taxi", projectId, "asia-northeast1");

// BigQuery
const bqDataset = new BigQueryDataset("next_taxi_demo", "next_taxi_demo");
bqDataset.datasetId.apply(datasetId => {
  new BigQueryTable(datasetId);
});

// PubSub
const realtimeTaxiStreamTopic = new PubSub("realtime-taxi-stream");
const extractChangePointTopic = new PubSub("extract-change-point");
const japanTaxiUpstreamTopic = new PubSub("jptx-upstream");
const jptxUpstreamRepublish = new PubSub("jptx-upstream-republish");

// ServiceAccount
const nextTokyoTaxiSA = new ServiceAccount("editor", "next-tokyo-taxi", "serviceaccount for demo");
nextTokyoTaxiSA.email.apply(email => {
  new ProjectIAMMember("editor", `serviceAccount:${email}`, "roles/editor");
});

// Service
const services = new gcp.projects.Services("project", {
  disableOnDestroy: false,
  project: projectId,
  services: [
    "bigquery-json.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudfunctions.googleapis.com",
    "compute.googleapis.com",
    "firestore.googleapis.com",
    "iam.googleapis.com",
    "identitytoolkit.googleapis.com",
    "logging.googleapis.com",
    "maps-backend.googleapis.com",
    "pubsub.googleapis.com",
    "storage-component.googleapis.com",
    "storage-api.googleapis.com",
  ],
});
services.id.apply(async id => {
  // Attach IAM role to CloudBuild serviceaccount
  const project = await gcp.organizations.getProject({ projectId: projectId });
  const projectNumber = project.number;
  new ProjectIAMMember("cloudbuildKeyCreator", `serviceAccount:${projectNumber}@cloudbuild.gserviceaccount.com`, "roles/iam.serviceAccountKeyAdmin");
  new ProjectIAMMember("cloudbuildKeyCreator", `serviceAccount:${projectNumber}@cloudbuild.gserviceaccount.com`, "roles/firebase.admin");
});
