import { Command } from '@lib/models/common';

export class PlayPause implements Command {
    domain: string = 'media_player';
    service: string = 'media_play_pause';
    data: any;
    entityId: string;

    constructor(name: string) {
        this.entityId = name;
    }
}

export class Mute implements Command {
    domain: string = 'media_player';
    service: string = 'volume_mute';
    data: { is_volume_muted: true };
    entityId: string;

    constructor(name: string) {
        this.data = { is_volume_muted: true };
        this.entityId = name;
    }
}

export class UnMute implements Command {
    domain: string = 'media_player';
    service: string = 'volume_mute';
    data: { is_volume_muted: false };
    entityId: string;

    constructor(name: string) {
        this.data = { is_volume_muted: false };
        this.entityId = name;
    }
}

export class Volume implements Command { 
    domain: string = 'media_player';
    service: string = 'volume_set';
    data: { volume_level: number }
    entityId: string;

    constructor(name: string, volume: number) {
        if (volume < 0 || volume > 1)
            throw new Error('Volume must be between 0 and 1.');

        this.data = { volume_level: volume };
        this.entityId = name;
    }
}