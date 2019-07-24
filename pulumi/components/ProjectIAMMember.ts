import * as gcp from "@pulumi/gcp";

export class ProjectIAMMember extends gcp.projects.IAMMember {
  constructor(name: string, member: string, role: string) {
    super(name, {
      member: member,
      role: role,
    });
  }
}
