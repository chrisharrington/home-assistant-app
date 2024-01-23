import { BaseEntity } from '../base';

export type Switch = BaseEntity & {
    attributes: {
        friendly_name: string;
        icon: string;
    }
}