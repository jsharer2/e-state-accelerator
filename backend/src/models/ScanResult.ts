import { Schema, model, Document, Types } from 'mongoose';

export interface IScanResult extends Document {
  userId: Types.ObjectId;
  totalMessages: number;
  totalEvidenceRows: number;
  totalDomains: number;
  accounts: Record<string, unknown>[];
  createdAt: Date;
}

const ScanResultSchema = new Schema<IScanResult>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalMessages: { type: Number, required: true },
  totalEvidenceRows: { type: Number, required: true },
  totalDomains: { type: Number, required: true },
  accounts: [Schema.Types.Mixed],
  createdAt: { type: Date, default: Date.now },
});

export const ScanResult = model<IScanResult>('ScanResult', ScanResultSchema);
