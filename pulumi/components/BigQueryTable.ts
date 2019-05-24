import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

import { BigQueryTableSchema } from './BigQueryTableSchema';

export class BigQueryTable {
  constructor(datasetId: string | pulumi.Output<string>) {
    for (const tableSchema of BigQueryTableSchema.bqTableList) {
      new gcp.bigquery.Table(tableSchema.tableId, {
        datasetId: datasetId,
        tableId: tableSchema.tableId,
        schema: tableSchema.schema,
      });
    }
  }
}
