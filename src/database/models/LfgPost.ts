import { Schema, model, Document } from 'mongoose';

export interface ILfgPost extends Document {
    guildId: string;
    messageId: string;
    ownerId: string;
    mode: string;
    note: string;
    active: boolean;
    participants: string[];
    voiceChannelId?: string;
    channelId: string;
    timeoutPrompted: boolean;
    isTimeout: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const lfgPostSchema = new Schema<ILfgPost>({
    guildId: { type: String, required: true },
    messageId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true },
    mode: { type: String, required: true },
    note: { type: String },
    active: { type: Boolean, default: true },
    participants: { type: [String], default: [] },
    voiceChannelId: { type: String },
    channelId: { type: String, required: true },
    timeoutPrompted: { type: Boolean, default: false },
    isTimeout: { type: Boolean, default: false },
}, { timestamps: true });

export const LfgPost = model<ILfgPost>('LfgPost', lfgPostSchema);
