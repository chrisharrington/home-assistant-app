import { Command } from '@lib/models/common';

export class LightOff implements Command {
    domain: string = 'light';
    service: string = 'turn_off';
    data: any;
    entityId: string;

    constructor(name: string) {
        this.entityId = name;
    }
}

export class LightOn implements Command {
    domain: string = 'light';
    service: string = 'turn_on';
    data: any;
    entityId: string;

    constructor(name: string) {
        this.entityId = name;
    }
}

export class LightBrightness implements Command {
    domain: string = 'light';
    service: string = 'turn_on';
    data: any;
    entityId: string;

    constructor(name: string, brightness: number) {
        this.entityId = name;
        this.data = {
            brightness
        };
    }
}

export class LightToggle implements Command {
    domain: string = 'light';
    service: string = 'toggle';
    data: any;
    entityId: string;

    constructor(name: string) {
        this.entityId = name;
    }
}