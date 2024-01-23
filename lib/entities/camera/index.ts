import { BaseEntity } from '../base';

export type Camera = BaseEntity & {
    attributes: {
        access_token: string;
        device_class: string;
        entity_picture: string;
        friendly_name: string;
        restream_type: string;
        supported_features: number;
    }
}