import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import useAsyncEffect from 'use-async-effect';
import { getBatteryLevelAsync } from 'expo-battery';
import { updateLocation } from '@lib/data/homeAssistant';
import { useSession } from '@lib/common/session';

const LOCATION_TASK_NAME = 'background-location-task';

export function useLocation() {
    useAsyncEffect(async () => {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted')
            throw new Error('Permission to access foreground location was denied.');

        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted')
            throw new Error('Permission to access background location was denied.');

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 1,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: 'Using your location',
                notificationBody: 'This notification cannot be disabled.'
            }
        });
    }, []);
}

TaskManager.defineTask<{ locations?: Array<Location.LocationObject> }>(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Error retrieving background location.', error);
        return;
    }

    if (data) {
        const { locations } = data;
        if (locations?.length) {
            const location = locations[0],
                batteryLevel = await getBatteryLevelAsync(),
                session = useSession.getState().session;

            if (session)
                updateLocation(session, {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    accuracy: location.coords.accuracy || 0,
                    battery: batteryLevel || 0
                });
        }
    }
});