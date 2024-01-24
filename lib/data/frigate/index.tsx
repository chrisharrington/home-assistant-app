import { Buffer } from 'buffer';
import { EXPO_PUBLIC_FRIGATE_USER_NAME, EXPO_PUBLIC_FRIGATE_PASSWORD } from '@env';
import Config from '@lib/config';
import { FrigateEvent } from '@lib/models/frigate';

export async function getEvents(cameraName: string, after: number, before: number) : Promise<FrigateEvent[]> {
    const params = [
        `camera=${cameraName}`,
        `after=${after}`,
        `before=${before}`,
        `has_clip=1`,
        `has_snapshot=1`,
        `include_thumbnails=1`,
        `limit=100000`
    ]; 

    const response = await fetch(`${Config.frigateBaseUrl}/api/events?${params.join('&')}`, {
        headers: {
            'Authorization': `Basic ${Buffer.from(`${EXPO_PUBLIC_FRIGATE_USER_NAME}:${EXPO_PUBLIC_FRIGATE_PASSWORD}`).toString('base64')}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok)
        throw new Error(`Failed to get events: ${response.status} ${response.statusText}`);

    const events = await response.json() as FrigateEvent[];
    return events.sort((a, b) => b.start_time - a.start_time);
}

export async function getEventClipUri(eventId: string) : Promise<string> {
    const response = await fetch(`${Config.frigateBaseUrl}/api/events/${eventId}/clip.mp4`, {
        headers: {
            'Authorization': `Basic ${Buffer.from(`${EXPO_PUBLIC_FRIGATE_USER_NAME}:${EXPO_PUBLIC_FRIGATE_PASSWORD}`).toString('base64')}`,
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
};