import { HassEntity } from "home-assistant-js-websocket";

export interface GpsPosition  {
    latitude?: number;
    longitude?: number;
}

export interface Editable {
    editable?: boolean;
}

export enum EntityType {
    Automation = 'automation',
    Battery = 'battery',
    Camera = 'camera',
    Climate = 'climate',
    Cover = 'cover',
    DeviceTracker = 'device_tracker',
    IlluminanceSensor = 'illuminance-sensor',
    Light = 'light',
    MediaPlayer = 'media_player',
    MotionSensor = 'motion-sensor',
    Person = 'person',
    Sensor = 'sensor',
    Switch = 'switch',
    TemperatureSensor = 'temperature-sensor',
    Zone = 'zone'
}

export type EntitiesReducer = {
    entities: EntityCollection;
    update: (entities: EntityCollection) => void;
}

export class EntityCollection {
    private _list: Entity[];
    private _dict: { [name: string]: Entity };

    constructor(entities?: Entity[]) {
        this._list = [];
        this._dict = {};

        if (entities)
            this.load(entities);
    }

    load(entities: Entity[]) : EntityCollection {
        this._list = entities || [];
        this._dict = (entities || []).reduce((result, item) => {
            result[item.id] = item;
            return result;
        }, {} as { [name: string]: Entity });
        return this;
    }

    get list() : Entity[] {
        return this._list;
    }

    get dict() : { [name: string]: Entity } {
        return this._dict;
    }

    filter = <TEntityType = Entity>(filter: (entity: Entity) => boolean) : TEntityType[] => this._list.filter(filter) as TEntityType[];
    find = <TEntityType>(filter: (entity: Entity) => boolean) : TEntityType | undefined => this._list.find(filter) as TEntityType | undefined;
    type = <TEntityType>(type: EntityType) : TEntityType[] => this._list.filter(entity => entity.type === type) as TEntityType[];
    id = <TEntityType>(id: string) : TEntityType | undefined => this._dict[id] as TEntityType;
    name = <TEntityType>(type: EntityType, name: string) : TEntityType | undefined => this._dict[`${type}.${name}`] as TEntityType;
    names = <TEntityType>(...names: string[]) : TEntityType[] => this._list.filter(e => names.includes(e.id)).sort((first, second) => names.indexOf(first.id) - names.indexOf(second.id)) as TEntityType[];

    clone() {
        return new EntityCollection(this.list);
    }
}

export enum EntitiesActionType {
    load,
    diff,
    bulkDiff
}

export abstract class Entity<StateType = string> {
    id: string;
    type: EntityType;
    state: StateType;
    friendlyName: string;

    constructor(type: EntityType, he: HassEntity) {
        this.id = he.entity_id;
        this.type = type;
        this.state = he.state as StateType;
        this.friendlyName = he.attributes.friendly_name || 'unknown';

        Object.keys(he.attributes).forEach(key => {
            (this as any)[this.toCamelCase(key)] = he.attributes[key];
        });
    }

    apply(diff: Diff) {
        if (diff.add) {
            if (diff.add.s)
                this.state = diff.add.s as StateType;
            if (diff.add.a) {
                Object.keys(diff.add.a).forEach(key => {
                    (this as any)[this.toCamelCase(key)] = (diff.add.a || {})[key];
                });
            }
        }

        if (diff.remove) {
            Object.keys(diff.remove.a).forEach(key => {
                delete (this as any)[key];
            });
        }
    }

    private toCamelCase(str: string) : string {
        return str.replace(/_([a-z])/g, s => s[1].toUpperCase());
    }
}

export interface Diff {
    entityName: string;
    
    add: {
        s?: string;
        a?: {
            [key: string]: any
        };
    };

    remove?: {
        a: string[]
    }
}