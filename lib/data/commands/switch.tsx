import { Command } from '@lib/models/common';

export class SwitchOff implements Command {
    domain: string = 'switch';
    service: string = 'turn_off';
    data: any;
    entityId: string;

    constructor(name: string) {
        this.entityId = name;
    }
}

export class SwitchOn implements Command {
    domain: string = 'switch';
    service: string = 'turn_on';
    data: any;
    entityId: string;

    constructor(name: string) {
        this.entityId = name;
    }
}

export class SwitchToggle implements Command {
    domain: string = 'switch';
    service: string = 'toggle';
    data: any;
    entityId: string;

    constructor(name: string) {
        this.entityId = name;
    }
}