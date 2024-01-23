import React from 'react';
import dayjs from 'dayjs';
import { View, Text, Pressable } from 'react-native';
import { Dayjs } from 'dayjs';
import colours from '@lib/colours';
import { StyleSheet } from '@lib/stylesheet';
import { MaterialIcons } from '@expo/vector-icons';

const RECORDING_RETENTION = 10;

type Props = {
    date: Dayjs;
    loading: boolean;
    onDateChanged: (day: Dayjs) => void;
};

export const DateSelector = (props: Props) => {
    const leftDisabled = props.loading || dayjs().startOf('day').subtract(RECORDING_RETENTION-1, 'day').isAfter(props.date),
        rightDisabled = props.loading || props.date.add(1, 'day').startOf('day').isAfter(dayjs());

    return <View style={styles.container}>
        <Pressable
            style={styles.arrow}
            disabled={leftDisabled}
            onPress={() => props.onDateChanged(props.date.subtract(1, 'day'))}
        >
            <MaterialIcons
                name='chevron-left'
                size={24}
                color={colours.primary.hex()}
            />
        </Pressable>

        <View style={styles.date}>
            <Text style={styles.dateLabel}>{props.date.format('MM/DD/YYYY')}</Text>
        </View>

        <Pressable
            style={styles.arrow}
            disabled={rightDisabled}
            onPress={() => props.onDateChanged(props.date.add(1, 'day'))}
        >
            <MaterialIcons
                name='chevron-right'
                size={24}
                color={colours.primary.hex()}
            />
        </Pressable>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        height: 90,
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: colours.background2.hex(),
        elevation: 3,
        overflow: 'hidden',
        padding: 20
    },

    date: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    dateLabel: {
        color: colours.text1.hex(),
        fontSize: 24,
        fontFamily: 'Lato Regular'
    },

    arrow: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colours.background1.hex(),
        borderRadius: 4
    }
});