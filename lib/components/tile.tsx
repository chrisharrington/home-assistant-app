import React, { PropsWithChildren } from 'react';
import { Pressable } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';

type Props = {
    onPress?: () => void;
    style?: any;
    title?: string;
}

export const Tile = ({ onPress, style, children } : PropsWithChildren<Props>) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.tile, style, onPress ? dynamicStyles.pressed(pressed) : undefined]}
    >
        {children}
    </Pressable>
);

const dynamicStyles = StyleSheet.dynamic({
    pressed: (pressed: boolean) => ({ opacity: pressed ? 0.7 : 1 })
});

const styles = StyleSheet.create({
    tile: {
        flex: 1,
        borderRadius: 4,
        padding: 15,
        overflow: 'hidden',
        backgroundColor: colours.background2.hex()
    },

    title: {
        flex: 1,
        color: colours.text1.hex(),
        fontSize: 20,
        marginBottom: 20
    }
});