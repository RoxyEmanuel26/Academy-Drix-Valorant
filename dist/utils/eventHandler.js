"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEvents = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const loadEvents = async (client) => {
    const eventsPath = path_1.default.join(__dirname, '../events');
    if (!fs_1.default.existsSync(eventsPath))
        return;
    const eventFiles = fs_1.default.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`../events/${file}`).default;
        if (event?.name && event?.execute) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, ...args));
            }
            else {
                client.on(event.name, (...args) => event.execute(client, ...args));
            }
        }
    }
};
exports.loadEvents = loadEvents;
