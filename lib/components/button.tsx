import React from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';

type Props = {
    label: string;
    action: () => void | Promise<void>;
    style?: any;
}

export const Button = ({ label, action, style } : Props) => (
    <Pressable
        style={[styles.button, style]}
        onPress={action}
    >        
        <Text style={styles.label}>{label}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        flex: 1,
        backgroundColor: colours.primary.hex(),
        borderRadius: 4,
        padding: 20,
        overflow: 'hidden'
    },

    label: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Lato Bold',
        textTransform: 'uppercase',
        color: colours.background1.hex()
    }
});