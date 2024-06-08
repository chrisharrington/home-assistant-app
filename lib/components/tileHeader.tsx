import React, { PropsWithChildren } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import Colours from '@lib/colours';
import { GlobalStyles } from '@lib/styles';

type Props = {
    label: string;
} & PropsWithChildren;

export function TileHeader({ label, children }: Props) {
    return <View style={styles.container}>
        <Text style={styles.name}>{label}</Text>

        {children && <View style={styles.info}>
            {children}
        </View>}
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: GlobalStyles.spacing/2
    },

    name: {
        flex: 1,
        flexGrow: 1,
        color: Colours.text1.hex(),
        fontSize: 20,
        alignSelf: 'flex-start'
    },

    info: {
        flex: 2,
        alignItems: 'flex-end'
    }
});