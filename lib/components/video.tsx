import React, { ReactElement, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Portal } from '@gorhom/portal';
import { ActivityIndicator, Animated, Pressable, View, StatusBar } from 'react-native';
import { AVPlaybackStatus, AVPlaybackStatusSuccess, ResizeMode, Video } from 'expo-av';
import { OrientationLock, lockAsync } from 'expo-screen-orientation';
import { useBackHandler } from '@react-native-community/hooks';
import { Buffer } from 'buffer';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useAppState } from '@lib/hooks/appState';

export type VideoProps = {
    uri: string;
    userName: string;
    password: string;
    controls: boolean;
    style?: any;
    fullScreenOnLoad?: boolean;
    onPress?: () => void;
    onFullScreenChanged?: (fs: boolean) => void;
}

export type Button = {
    name: string;
    icon: ReactElement;
    action: () => void;
}

export type Actions = {
    play: () => Promise<AVPlaybackStatus | undefined>,
    pause: () => Promise<AVPlaybackStatus | undefined>,
    seekTo: (time: number) => void,
    seekForward: () => void,
    seekBackward: () => void,
    fullScreen: (fs: boolean) => void;
}

export const VideoPlayer = forwardRef<Actions, VideoProps>(({ uri, style, userName, password, controls, fullScreenOnLoad, onFullScreenChanged, onPress }, ref) => {
    const [fullScreen, setFullScreen] = useState<boolean>(fullScreenOnLoad || false),
        [loading, setLoading] = useState<boolean>(false),
        videoRef = useRef<Video>(null),
        fadeOpacity = useRef(new Animated.Value(0)).current,
        loaderOpacity = useRef(new Animated.Value(0)).current,
        timestamp = useRef<dayjs.Dayjs | null>(null);

    useImperativeHandle(ref, () => ({
        play: async () => await videoRef.current?.playAsync(),
        pause: async () => await videoRef.current?.pauseAsync(),
        seekTo: async (time: number) => await videoRef.current?.setPositionAsync(time),
        seekForward: async () => await videoRef.current?.setPositionAsync((await videoRef.current?.getStatusAsync() as AVPlaybackStatusSuccess).positionMillis + 10000),
        seekBackward: async () => videoRef.current?.setPositionAsync((await videoRef.current?.getStatusAsync() as AVPlaybackStatusSuccess).positionMillis - 10000),
        fullScreen: (fs: boolean) => setFullScreen(fs)
    }));

    useBackHandler(() => {
        if (fullScreen) {
            setFullScreen(false);
            return true;
        }

        return false;
    });
 
    useEffect(() => {
        if (fullScreen) {
            activateKeepAwakeAsync();
            lockAsync(OrientationLock.LANDSCAPE_RIGHT);
            StatusBar.setHidden(true);
        } else {
            if (!__DEV__)
                deactivateKeepAwake();
            lockAsync(OrientationLock.PORTRAIT);
            StatusBar.setHidden(false);
        }

        if (onFullScreenChanged)
            onFullScreenChanged(fullScreen);
    }, [fullScreen]);

    useEffect(() => {
        Animated.timing(fadeOpacity, {
            toValue: loading ? 0.5 : 0,
            duration: 150,
            useNativeDriver: true
        }).start();

        Animated.timing(loaderOpacity, {
            toValue: loading ? 1 : 0,
            duration: 150,
            useNativeDriver: true
        }).start();
    }, [loading]);

    useAppState({
        onForeground: async () => {
            const status = await videoRef.current?.getStatusAsync() as AVPlaybackStatusSuccess;
            await videoRef.current?.playFromPositionAsync(status?.positionMillis + dayjs().diff(timestamp.current, 'millisecond'));
        },
        onBackground: async () => {
            timestamp.current = dayjs();
            await videoRef.current?.pauseAsync();
        }
    });
    
    return <Pressable
        style={styles.container}
        onPress={() => !loading && !fullScreen && onPress && onPress()}
    >
        {fullScreen ? <Portal>
            <View style={styles.fullScreen}>
                {renderVideo()}
            </View>
        </Portal> : renderVideo()}

        <Animated.View style={[styles.cover, styles.fade, { pointerEvents: loading ? 'auto' : 'none', opacity: fadeOpacity }]} />

        <Animated.View style={[styles.cover, styles.loader, { pointerEvents: loading ? 'auto' : 'none', opacity: loaderOpacity }]}>
            <ActivityIndicator
                size='large'
                color={colours.primary.hex()}
            />
        </Animated.View>
    </Pressable>;

    function renderVideo() {
        return <Video
            useNativeControls={controls || false}
            style={[styles.video, style]}
            source={{
                uri,
                headers: {
                    authorization: `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`
                }
            }}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            ref={videoRef}
            onLoadStart={() => setLoading(true)}
            onReadyForDisplay={() => setLoading(false)}
        />;
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    video: {
        flex: 1,
        width: '100%',
        height: '100%'
    },

    fullScreen: {
        position: 'absolute',
        zIndex: 10,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },

    cover: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: 4
    },

    fade: {
        backgroundColor: 'black',
        zIndex: 2
    },

    loader: {
        zIndex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none'
    },

    buttons: {
        zIndex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 50
    },

    hidden: {
        display: 'none'
    },

    shown: {
        display: 'flex'
    }
});