import mongoose, { Document, Schema } from 'mongoose';

export type ActivityActionType =
  | 'USER_LOGIN'
  | 'USER_REGISTER'
  | 'USER_ROLE_CHANGED'
  | 'USER_SUSPENDED'
  | 'USER_REACTIVATED'
  | 'USER_DELETED'
  | 'TEMPLATE_CREATED'
  | 'TEMPLATE_UPDATED'
  | 'TEMPLATE_PUBLISHED'
  | 'TEMPLATE_UNPUBLISHED'
  | 'TEMPLATE_DELETED'
  | 'TEMPLATE_VERSION_BUMPED'
  | 'TEMPLATE_ROLLBACK'
  | 'COUNTRY_CREATED'
  | 'COUNTRY_UPDATED'
  | 'COUNTRY_DELETED'
  | 'SETTINGS_UPDATED'
  | 'DATABASE_MAINTENANCE'
  | 'SYSTEM_BACKUP';

export interface IActivityLog extends Document {
  adminEmail: string;
  adminName?: string;
  action: ActivityActionType;
  entityType: 'user' | 'template' | 'country' | 'settings' | 'system' | 'cv';
  entityId?: string;
  details: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export const ActivityLogSchema: Schema = new Schema(
  {
    adminEmail: {
      type: String,
      required: true,
      index: true,
    },
    adminName: {
      type: String,
      default: 'Administrator',
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ActivityLogModel =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
