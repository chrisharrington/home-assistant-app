import React, { createRef, useRef, useState } from 'react';
import { View, Text, PanResponder, Animated, Easing, Image, ActivityIndicator } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { Layout } from '@lib/models/common';

const GarageDoorIcon = require('@assets/garage-door.png');

type Props = {
    hint: string;
    onConfirm: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export const SlideConfirm = (props: Props) => {
    const [startPoint, setStartPoint] = useState<number | null>(null),
        [position, setPosition] = useState<number | null>(null),
        [trackLayout, setTrackLayout] = useState<Layout | null>(null),
        [buttonLayout, setButtonLayout] = useState<Layout | null>(null),
        viewRef = createRef<View>();

    const pan = useRef(new Animated.Value(0)).current;
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => !props.disabled,
        onPanResponderGrant: (e) => {
            if (startPoint === null)
                setStartPoint(e.nativeEvent.pageX);
        },
        onPanResponderMove: (e) => {
            const min = 0,
                max = (trackLayout?.width || 0) - (buttonLayout?.width || 0);

            let p = e.nativeEvent.pageX - (startPoint || 0);
            p = Math.min(max, p);
            p = Math.max(min, p);
            pan.setValue(p);
            setPosition(p);
        },
        onPanResponderRelease: () => {
            if (position === (trackLayout?.width || 0) - 44)
                props.onConfirm();

            Animated.timing(pan, {
                toValue: 0,
                easing: Easing.out(Easing.ease),
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    })

    return <View style={styles.container}>
        <View
            style={styles.track}
            onLayout={event => setTrackLayout(event.nativeEvent.layout)}
        >
            <Animated.View
                ref={viewRef}
                style={[styles.button, { transform: [{ translateX: pan }] }, { backgroundColor: colours.button1.hex() }]}
                {...panResponder.panHandlers}
                onLayout={event => setButtonLayout(event.nativeEvent.layout)}
            >
                {props.loading ? <ActivityIndicator
                    color={colours.text1.hex()}
                /> : <Image
                    source={GarageDoorIcon}
                    style={styles.buttonIcon}
                />}
            </Animated.View>
            <Text style={styles.hint}>{props.hint}</Text>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {

    },

    track: {
        backgroundColor: colours.background1.hex(),
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44
    },

    hint: {
        color: colours.primary.hex(),
        fontSize: 12,
        fontFamily: 'Open Sans'
    },

    button: {
        position: 'absolute',
        zIndex: 1,
        top: 0,
        left: 0,
        width: 44,
        height: 44,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonIcon: {
        width: 40,
        height: 40
    }
});