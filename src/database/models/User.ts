import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    discordId: string;
    riotPuuid?: string;
    riotGameName?: string;
    riotTagLine?: string;
    region: string;
    linkedAt?: Date;
    optIn: boolean;
    statsCache?: {
        rank?: string;
        totalWins?: number;
        totalLosses?: number;
        winrate?: number;
    };
}

const userSchema = new Schema<IUser>({
    discordId: { type: String, required: true, unique: true },
    riotPuuid: { type: String, sparse: true },
    riotGameName: { type: String },
    riotTagLine: { type: String },
    region: { type: String, default: 'ap' },
    linkedAt: { type: Date },
    optIn: { type: Boolean, default: false },
    statsCache: {
        rank: String,
        totalWins: Number,
        totalLosses: Number,
        winrate: Number,
    }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
