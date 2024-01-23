import { HassEntity } from 'home-assistant-js-websocket';

export type BaseEntity<TAttributes extends BaseAttributes = BaseAttributes, TState = string> = {
    last_changed: string;
    last_updated: string;
    state: TState;
    entity_id: string;
    attributes: TAttributes;
} & Omit<HassEntity, 'attributes'>;

export type BaseAttributes = {
    friendly_name?: string;
    icon?: string;
}