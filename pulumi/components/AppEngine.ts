import * as gcp from "@pulumi/gcp";

export class AppEngine extends gcp.appengine.Application {
  constructor(
    id: string, project: string, locationId: string = "us-central1", authDomain: string = "gmail.com") {
    super(id, {
      project: project,
      locationId: locationId,
      authDomain: authDomain,
    });
  }
}
