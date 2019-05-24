import * as gcp from "@pulumi/gcp";

export class PubSub extends gcp.pubsub.Topic {
  constructor(name: string) {
    super(name, {
      name: name
    });
  }
}
