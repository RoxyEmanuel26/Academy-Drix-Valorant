import { Schema, model, Document } from 'mongoose';

export interface IGuildConfig extends Document {
    guildId: string;
    leaderboardChannelId?: string;
    prefix: string;
    missionsEnabled: boolean;
}

const guildConfigSchema = new Schema<IGuildConfig>({
    guildId: { type: String, required: true, unique: true },
    leaderboardChannelId: { type: String },
    prefix: { type: String, default: '!' },
    missionsEnabled: { type: Boolean, default: true },
}, { timestamps: true });

export const GuildConfig = model<IGuildConfig>('GuildConfig', guildConfigSchema);
