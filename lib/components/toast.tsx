import React from 'react';
import { useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Portal } from '@gorhom/portal';
import colours from '@lib/colours';

export enum ToastType {
    Error,
    Success
}

export type ToastHandle = {
    clear: () => void;
    error: (message: string) => void;
    success: (message: string) => void;
}

export const Toast = React.forwardRef<ToastHandle>((_, ref) => {
    const opacity = useRef<Animated.Value>(new Animated.Value(0)).current,
        position = useRef<Animated.Value>(new Animated.Value(25)).current,
        [message, setMessage] = useState<string>(''),
        [type, setType] = useState<ToastType>(ToastType.Success),
        timeout = useRef<any>();

    useImperativeHandle(ref, () => ({ clear, error, success }));

    return <Portal>
        <Animated.View style={[
            styles.container,
            { opacity: opacity, transform: [{ translateY: position }] }
        ]}>
            <Text style={[styles.text, { backgroundColor: getBackgroundColour(type) }]}>{message}</Text>
        </Animated.View>
    </Portal>;

    async function clear() : Promise<void> {
        await toggle(false);
        setMessage('');
    }

    async function error(message: string) : Promise<void> {
        await messageInternal(message, ToastType.Error);
    }

    async function success(message: string) : Promise<void> {
        await messageInternal(message, ToastType.Success);
    }

    async function messageInternal(newMessage: string, type: ToastType) : Promise<void> {
        const previous = message,
            current = newMessage;

        if (!previous && current) {
            setMessage(current);
            setType(type);
            await toggle(true);
        } else if (previous && current) {
            await toggle(false);
            setMessage(current);
            setType(type);
            await toggle(true);
        }

        if (timeout.current)
            clearTimeout(timeout.current);

        timeout.current = setTimeout(() => clear(), 5000);
    }

    function getBackgroundColour(type: ToastType) : string {
        switch (type) {
            case ToastType.Error:
                return colours.error.hex();
            case ToastType.Success:
                return colours.success.hex();
            default:
                return colours.background1.hex();
        }
    }

    async function toggle(visible: boolean) : Promise<void> {
        return new Promise<void>(resolve => {
            Animated.timing(opacity, {
                toValue: visible ? 1 : 0,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.linear
            }).start();

            Animated.timing(position, {
                toValue: visible ? 0 : 25,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.linear
            }).start();

            setTimeout(() => resolve(), 200);
        });
    }
});


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 2
    },

    text: {
        color: colours.text1.hex(),
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 14
    }
});