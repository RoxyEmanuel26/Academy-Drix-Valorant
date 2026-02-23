import { Schema, model, Document } from 'mongoose';

export interface IMission extends Document {
    guildId: string;
    userId: string;
    type: 'daily' | 'weekly';
    description: string;
    target: number;
    progress: number;
    startAt: Date;
    endAt: Date;
    completed: boolean;
}

const missionSchema = new Schema<IMission>({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    type: { type: String, enum: ['daily', 'weekly'], required: true },
    description: { type: String, required: true },
    target: { type: Number, required: true },
    progress: { type: Number, default: 0 },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    completed: { type: Boolean, default: false },
}, { timestamps: true });

export const Mission = model<IMission>('Mission', missionSchema);
