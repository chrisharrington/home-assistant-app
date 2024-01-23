import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { create } from 'zustand';
import { createConnection, subscribeEntities, createLongLivedTokenAuth, HassEntity, Connection, callService } from 'home-assistant-js-websocket';
import Constants from 'expo-constants';
import Config from '@lib/config';
import { EXPO_PUBLIC_HOME_ASSISTANT_API_KEY } from '@env';
import { Command, EntityType } from '@lib/models';
import { BaseEntity } from '@lib/entities/base';
import { Person } from '@lib/entities';
import { Session } from '@lib/common/session';
import { getExpoPushTokenAsync, getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications';

let connection: Connection | null = null;

type StateChangeEvent = {
    event_type: string;
    entity_id: string;
    data: {
        old_state: HassEntity;
        new_state: HassEntity;
    }
}

type Location = {
    latitude: number;
    longitude: number;
    accuracy: number;
    battery: number;
}

type EntityStore = {
    list: BaseEntity[];
    id: <TEntityType>(id: string) => TEntityType | undefined;
    type: <TEntityType>(type: EntityType) => TEntityType[];
    update: (event: StateChangeEvent) => void;
}

export const useEntities = create<EntityStore>((set, get) => ({
    list: [],
    id: <TEntityType>(id: string) => get().list.find(entity => entity.entity_id === id) as TEntityType | undefined,
    type: <TEntityType>(type: EntityType) => get().list.filter(entity => entity.entity_id.split('.')[0] === type) as TEntityType[],
    update: (event: StateChangeEvent) => set(state => {
        const index = state.list.findIndex(entity => entity.entity_id === event.entity_id);
        if (index === -1)
            return state;

        const newState = { ...state };
        newState.list[index].state = event.data.new_state.state;
        newState.list[index].attributes = event.data.new_state.attributes;
        return newState;
    })
}));

export async function connect() {
    const auth = createLongLivedTokenAuth(Config.homeAssistantBaseUrl, EXPO_PUBLIC_HOME_ASSISTANT_API_KEY);
    connection = await createConnection({ auth });
    connection.subscribeEvents<StateChangeEvent>(useEntities.getState().update, 'state_changed');

    subscribeEntities(connection, hassEntities => {
        useEntities.setState({ list: Object.values(hassEntities).map(e => e as BaseEntity) });
    });
}

export async function service(command: Command) {
    if (!connection)
        return;

    await callService(connection, command.domain, command.service, command.data, {
        entity_id: command.entityId
    });
}

export async function updateLocation(session: Session, location: Location) {
    // const uri = Config.homeAssistantWebhookUri + session.webhook_id;
    // const response = await fetch(uri, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         type: 'update_location',
    //         data: {
    //             gps: [location.latitude, location.longitude],
    //             gps_accuracy: location.accuracy,
    //             battery: location.battery
    //         }
    //     })
    // });

    // if (!response.ok)
    //     throw new Error('Unable to update location.');
}

export async function register(user: Person): Promise<string> {
    let appData: { push_token: string | undefined, push_url: string | undefined } = { push_token: undefined, push_url: undefined };

    if (!__DEV__) {
        appData.push_token = await getPushToken();
        appData.push_url = `${Config.homeApiBaseUrl}/notification`;
    }

    const response = await fetch(`${Config.homeAssistantBaseUrl}/api/mobile_app/registrations`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${EXPO_PUBLIC_HOME_ASSISTANT_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            device_id: Application.getAndroidId(),
            app_id: Application.applicationName,
            app_name: Application.applicationName,
            app_version: Application.nativeApplicationVersion,
            device_name: `${user.attributes.friendly_name.split(' ')[0]}'s Phone (App)`,
            manufacturer: Device.brand,
            model: Device.modelName,
            os_name: Device.osName,
            os_version: Device.osVersion,
            supports_encryption: false,
            app_data: appData
        })
    });

    if (!response.ok)
        throw new Error('Unable to register mobile device with Home Assistant.');

    return (await response.json()).webhook_id;
}

async function getPushToken(): Promise<string | undefined> {
    let token: string | undefined = undefined;

    let { granted } = await getPermissionsAsync();
    if (!granted)
        granted = (await requestPermissionsAsync()).granted;

    if (granted) {
        token = (await getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas.projectId })).data;
        console.log(`Generated push token ${token}.`);
    } else
        console.error('Notifications permission not granted.');

    return token;
}