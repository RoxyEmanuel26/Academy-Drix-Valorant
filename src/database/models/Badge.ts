import { Schema, model, Document } from 'mongoose';

export interface IBadge extends Document {
    guildId: string;
    userId: string;
    code: string;
    name: string;
    description: string;
    earnedAt: Date;
}

const badgeSchema = new Schema<IBadge>({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    earnedAt: { type: Date, default: Date.now }
});

export const Badge = model<IBadge>('Badge', badgeSchema);
