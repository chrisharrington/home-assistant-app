import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export type AppStateFunctions = {
    onBackground: () => Promise<void> | void;
    onForeground: () => Promise<void> | void;
}

export function useAppState(functions: AppStateFunctions) {
    useEffect(() => {
        const listener = AppState.addEventListener('change', handleAppStateChange);
        return () => listener.remove();
    }, []);

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active')
            await functions.onForeground();
        else if (nextAppState === 'background')
            await functions.onBackground();
    };
}