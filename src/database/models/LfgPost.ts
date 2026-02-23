import { Schema, model, Document } from 'mongoose';

export interface ILfgPost extends Document {
    guildId: string;
    messageId: string;
    ownerId: string;
    mode: string;
    note: string;
    active: boolean;
    participants: string[];
}

const lfgPostSchema = new Schema<ILfgPost>({
    guildId: { type: String, required: true },
    messageId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true },
    mode: { type: String, required: true },
    note: { type: String },
    active: { type: Boolean, default: true },
    participants: { type: [String], default: [] },
}, { timestamps: true });

export const LfgPost = model<ILfgPost>('LfgPost', lfgPostSchema);
