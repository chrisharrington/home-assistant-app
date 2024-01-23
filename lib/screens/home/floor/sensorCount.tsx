import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type Props = {
    text: string;
    materialCommunityIconName?: string;
    materialIconName?: string;
    iconSizeModifier?: number;
}

export const SensorCount = ({ text, materialCommunityIconName, materialIconName, iconSizeModifier } : Props) => {
    return <View style={styles.sensor}>
        {materialCommunityIconName && <MaterialCommunityIcons
            name={materialCommunityIconName as any}
            size={16 + (iconSizeModifier || 0)}
            color={colours.text2.hex()}
            style={styles.sensorIcon}
        />}

        {materialIconName && <MaterialIcons
            name={materialIconName as any}
            size={16 + (iconSizeModifier || 0)}
            color={colours.text2.hex()}
            style={styles.sensorIcon}
        />}

        <Text style={styles.sensorValue}>{text}</Text>
    </View>;
}

const styles = StyleSheet.create({
    sensor: {
        flexDirection: 'row',
        borderRadius: 4,
        paddingLeft: 4,
        paddingRight: 6
    },
    
    sensorIcon: {
        width: 18,
        height: 18,
        alignSelf: 'center'
    },

    sensorValue: {
        fontSize: 14,
        color: colours.text1.hex(),
        marginLeft: 4,
        fontFamily: 'Lato Regular',
        textAlign: 'right',
        textAlignVertical: 'center'
    }
});