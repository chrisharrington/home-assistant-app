import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View, StatusBar as NativeStatusBar, LogBox, Text } from 'react-native';
import { PortalProvider } from '@gorhom/portal';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { lockAsync, OrientationLock } from 'expo-screen-orientation';
import { useFonts } from 'expo-font';
import { useSession } from '@lib/common/session';
import { Toast, ToastHandle } from '@lib/components/toast';
import colours from '@lib/colours';
import { StateContext } from '@lib/context';
import { LoaderBoundary } from '@lib/components/loaderBoundary';
import { connect } from '@lib/data/homeAssistant';
import '@lib/common/date';

LogBox.ignoreLogs(['new NativeEventEmitter()']);

const entitiesResource = connect();

export default function App() {
    const { session } = useSession(),
        toast = useRef<ToastHandle>(null);

    useFonts({
        'Lato Regular': require('@assets/Lato-Regular.ttf'),
        'Lato Bold': require('@assets/Lato-Bold.ttf'),
        'Lora': require('@assets/Lora.ttf'),
        'Open Sans': require('@assets/OpenSans.ttf')
    });

    // useLocation();

    useEffect(() => {
        lockAsync(OrientationLock.PORTRAIT);
    }, []);

    return <PortalProvider>
        <Toast ref={toast} />
        <StatusBar style='light' backgroundColor={colours.background1.hex()} />

        <StateContext.Provider value={{ toast: toast.current as ToastHandle }}>
            <LoaderBoundary
                loadingFallback={<LoadingFallback />}
                errorFallback={<ErrorFallback />}
            >
                <Main />
            </LoaderBoundary>
        </StateContext.Provider>
    </PortalProvider>;

    function Main() {
        entitiesResource.read();

        return <>

            <View style={styles.container}>
                <Slot />
            </View>
        </>;
    }

    function LoadingFallback() {
        return <View style={styles.loaderContainer}>
            <ActivityIndicator size='large' color={colours.primary.hex()} />
        </View>;
    }

    function ErrorFallback() {
        return <View style={styles.error}>
            <Text style={styles.errorTitle}>Uh oh!</Text>
            <Text style={styles.errorText}>We've run into a problem. Please try again later.</Text>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: NativeStatusBar.currentHeight,
        backgroundColor: colours.background1.hex()
    },

    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colours.background1.hex()
    },

    error: {
        flex: 1,
        backgroundColor: colours.background1.hex(),
        padding: 20,
        marginTop: NativeStatusBar.currentHeight
    },

    errorTitle: {
        color: colours.text1.hex(),
        fontSize: 32,
        fontWeight: 'bold'
    },

    errorText: {
        color: colours.text1.hex(),
        fontSize: 16,
        marginTop: 25
    }
});