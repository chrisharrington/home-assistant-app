import { Command } from '@lib/models/common';

export class SetTemperature implements Command {
    domain: string = 'climate';
    service: string = 'set_temperature';
    data: any;
    entityId: string;

    constructor(name: string, temperature: number) {
        this.entityId = name;
        this.data = { temperature };
    }
}