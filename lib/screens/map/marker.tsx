import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import colours from '@lib/colours';
import { AntDesign } from '@expo/vector-icons';

type  Props = {
    content: React.ReactNode;
    latitude: number;
    longitude: number;
    width: number;
}

export const CustomMarker = ({ content, latitude, longitude, width } : Props) => (
    <Marker
        coordinate={{ latitude, longitude }}
        anchor={{ x: 0.5, y: 1 }}
    >
        <View style={[styles.container, { width }]}>
            {content}
            <AntDesign style={styles.arrow} name='caretdown' size={12} color={colours.background3.hex()} />
        </View>
    </Marker>
);

const styles = StyleSheet.create({
    container: {
        height: 54
    },

    arrow: {
        position: 'absolute',
        bottom: 3,
        left: '50%',
        transform: [{ translateX: -6 }]
    }
});