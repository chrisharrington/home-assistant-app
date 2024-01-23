import { Command } from '@lib/models/common';

export class CloseCover implements Command {
    domain: string = 'cover';
    service: string = 'close_cover';
    data: any;
    entityId: string;

    constructor(name: string) {
        this.entityId = name;
    }
}

export class OpenCover implements Command {
    domain: string = 'cover';
    service: string = 'open_cover';
    data: any;
    entityId: string;

    constructor(name: string) {
        this.entityId = name;
    }
}