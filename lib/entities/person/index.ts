import { BaseEntity } from '../base';

export type Person = BaseEntity & {
    attributes: {
        editable: boolean;
        id: string;
        latitude: number;
        longitude: number;
        gps_accuracy: number;
        source: string;
        user_id: string;
        device_trackers: string[];
        entity_picture: string;
        friendly_name: string;
    }
}