import { getPermissionsAsync, requestPermissionsAsync, scheduleNotificationAsync, setNotificationHandler } from 'expo-notifications';
import { HassEvent } from 'home-assistant-js-websocket';

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    })
});

const permissionGranted: Promise<boolean | null> = new Promise<boolean | null>(async resolve => {
    let { granted } = await getPermissionsAsync();
    if (!granted)
        granted = (await requestPermissionsAsync()).granted;
    resolve(granted);
});

export async function handleNotificationEvent(event: HassEvent) {
    await permissionGranted;
    scheduleNotificationAsync({
        content: {
            title: event.data.title,
            body: event.data.body
        },
        trigger: null
    });
}