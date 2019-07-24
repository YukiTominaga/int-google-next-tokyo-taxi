import * as gcp from "@pulumi/gcp";

export class BigQueryDataset extends gcp.bigquery.Dataset {
  constructor(name: string, datasetId: string, location: string = "US") {
    super(name, {
      datasetId: datasetId,
      location: location,
    });
  }
}