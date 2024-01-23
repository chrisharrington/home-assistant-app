import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';

type Props = {
    icon: (colour: string, size: number) => JSX.Element;
    label: string;
    action: JSX.Element;
}

export const Inline = ({ icon, label, action } : Props) => {
    return <View style={styles.container}>
        <View style={styles.iconContainer}>
            {icon(colours.text1.hex(), 24)}
        </View>

        <Text style={styles.label}>{label}</Text>

        <View style={styles.actionContainer}>
            {action}
        </View>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: colours.background2.hex(),
        marginTop: 1
    },

    iconContainer: {
        width: 30,
        alignItems: 'center',
        color: colours.text1.hex(),
        marginRight: 20
    },

    label: {
        width: 120,
        fontSize: 18,
        color: colours.text1.hex(),
        fontFamily: 'Lato Regular'
    },

    actionContainer: {
        flex: 1,
        justifyContent: 'center',
        height: 26
    }
});