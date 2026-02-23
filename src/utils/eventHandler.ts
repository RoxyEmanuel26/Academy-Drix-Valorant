import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';

export const loadEvents = async (client: Client) => {
    const eventsPath = path.join(__dirname, '../events');
    if (!fs.existsSync(eventsPath)) return;

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`).default;
        if (event?.name && event?.execute) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, ...args));
            } else {
                client.on(event.name, (...args) => event.execute(client, ...args));
            }
        }
    }
};
