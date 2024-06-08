import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { useBackHandler } from '@react-native-community/hooks';
import { EXPO_PUBLIC_VIDEO_PASSWORD, EXPO_PUBLIC_VIDEO_USER_NAME } from '@env';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import Config from '@lib/config';
import { Actions, VideoPlayer } from '@lib/components/video';
import { SlideUp } from '@lib/components/slideUp';
import { Button } from '@lib/components/button';

type Props = {
    cameraName: string;
}

export const CameraComponent = ({ cameraName }: Props) => {
    const cameraRef = useRef<Actions>(null),
        [menuVisible, setMenuVisible] = useState<boolean>(false),
        [cameraWidth, setCameraWidth] = useState<number>(0);

    useBackHandler(() => {
        if (menuVisible) {
            setMenuVisible(false);
            return true;
        }

        return false;
    });

    return <View
        style={styles.camera}
        key={cameraName}
        onLayout={event => setCameraWidth(event.nativeEvent.layout.width)}
    >
        <VideoPlayer
            ref={cameraRef}
            uri={`${Config.videoBaseUrl}/api/stream.mp4?src=${cameraName}&mp4=flac`}
            style={[styles.video, { width: cameraWidth === 0 ? undefined : cameraWidth }]}
            userName={EXPO_PUBLIC_VIDEO_USER_NAME}
            password={EXPO_PUBLIC_VIDEO_PASSWORD}
            controls={false}
            onPress={() => setMenuVisible(true)}
        />

        <SlideUp visible={menuVisible}>
            <View style={styles.buttons}>
                <Button
                    style={styles.button}
                    label='Events'
                    action={() => {
                        // navigate('Camera', { cameraName });
                        setMenuVisible(false);
                    }}
                />

                <Button
                    style={styles.button}
                    label='Full Screen'
                    action={() => {
                        cameraRef.current?.fullScreen(true);
                        setMenuVisible(false);
                    }}
                />
            </View>
        </SlideUp>
    </View>;
}

const styles = StyleSheet.create({
    cover: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: 4,
        pointerEvents: 'none'
    },

    fade: {
        backgroundColor: 'black',
        zIndex: 2
    },

    buttons: {
       flexDirection: 'row',
       gap: 25,
       padding: 20
    },

    button: {
        flex: 1
    },

    camera: {
        flex: 1
    },

    video: {
        backgroundColor: colours.background1.hex(),
        aspectRatio: 16 / 9,
        borderRadius: 4
    }
})