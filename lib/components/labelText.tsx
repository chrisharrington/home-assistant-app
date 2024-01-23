import React from 'react';
import { View, Text } from 'react-native';

import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';

type Props = {
    label: string;
    text: string | undefined;
    subtext?: string;
    style?: any;
};

export const LabelText = ({ label, text, subtext, style }: Props) => (
    <View style={[styles.container, style]}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.textContainer}>
            <Text style={styles.text}>{text || '-'}</Text>
            {subtext && <Text style={styles.subtext}>{subtext}</Text>}
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {

    },

    label: {
        fontSize: 12,
        color: colours.primary.hex(),
        fontFamily: 'Open Sans',
        marginBottom: 2
    },

    textContainer: {
        flex: 1,
        flexDirection: 'row'
    },

    text: {
        fontSize: 22,
        fontFamily: 'Roboto',
        color: colours.text1.hex(),
    },
    
    subtext: {
        fontSize: 11,
        fontFamily: 'Roboto',
        color: colours.text1.hex(),
        marginLeft: 6,
        marginTop: 13
    }
});