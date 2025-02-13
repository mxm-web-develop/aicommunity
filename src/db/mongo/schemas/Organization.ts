import mongoose, { Schema, model, models } from 'mongoose';

export interface IOrganization {
  name: string;
  // subGroup: string[];
  logo: string;
  description: string;
  url: string;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    // subGroup: { type: [String], default: [] },
    logo: { type: String, required: false },
    description: { type: String, required: false },
    url: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const Organization = models.Organization || model<IOrganization>('Organization', organizationSchema);