import { EXPO_PUBLIC_HOME_API_KEY } from '@env'
import Config from '@lib/config';
import { wrapFetchPromise } from '@lib/data/wrap';

export type Balance = {
    amount: number;
    change: number;
}

const headers = {
    Authorization: `Bearer ${EXPO_PUBLIC_HOME_API_KEY}`
};

export function getBalance(): { read: () => Balance; } {
    return wrapFetchPromise(`${Config.homeApiBaseUrl}/investments/balance`, { headers });
}

export function getExchange(): { read: () => number; } {
    return wrapFetchPromise(`${Config.homeApiBaseUrl}/exchange`, { headers });
}