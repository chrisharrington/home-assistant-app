import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';

type Props = {
    text: string;
    icon: React.ReactNode;
}

export const Count = ({ text, icon }: Props) => {
    return <View style={styles.container}>
        {icon}
        <Text style={styles.value}>{text}</Text>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 4,
        paddingRight: 6
    },

    value: {
        fontSize: 14,
        color: colours.text1.hex(),
        marginLeft: 8,
        fontFamily: 'Lato Regular',
        textAlign: 'right',
        textAlignVertical: 'center'
    }
});