import * as gcp from "@pulumi/gcp";

export class ServiceAccount extends gcp.serviceAccount.Account {
  constructor(name: string, accountId: string, displayName: string) {
    super(name, {
      accountId: accountId,
      displayName: displayName,
    });
  }
}
