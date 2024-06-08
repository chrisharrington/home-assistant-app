import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { Tile } from '@lib/components/tile';
import { useEntities } from '@lib/data/homeAssistant';
import { Count } from '@lib/components/count';
import { GlobalStyles } from '@lib/styles';
import { EntityButton } from './entityButton';

type Props = {
    name: string;
    entityIds: string[];
    temperature: number;
    humidity: number;
    onPress: () => void;
}

export const Floor = ({ name, entityIds, temperature, humidity, onPress } : Props) => {
    const floorEntities = useEntities()
        .filter(entity => entityIds.includes(entity.entity_id))
        .sort((first, second) => (first.attributes.friendly_name || '').localeCompare(second.attributes.friendly_name || ''));

    return <Pressable onPress={onPress}>
        <Tile style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{name}</Text>

                <View style={styles.sensors}>
                    <Count
                        text={`${temperature}°`}
                        icon={<MaterialCommunityIcons name='thermometer' size={20} color={colours.primary.hex()} />}
                    />

                    <Count
                        icon={<MaterialCommunityIcons name='water-outline' size={18} color={colours.primary.hex()} />}
                        text={`${humidity}%`}
                    />
                </View>
            </View>

            <View style={styles.entities}>
                {floorEntities.map(entity => (
                    <EntityButton
                        key={entity.entity_id}
                        entity={entity}
                    />
                ))}
            </View>
        </Tile>
    </Pressable>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: GlobalStyles.spacing/2
    },

    name: {
        flex: 1,
        color: colours.text1.hex(),
        fontSize: 20,
        alignSelf: 'flex-start'
    },

    sensors: {
        flex: 2,
        flexDirection: 'row',
        borderRadius: GlobalStyles.borderRadius,
        gap: 4,
        justifyContent: 'flex-end'
    },

    entities: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GlobalStyles.spacing/2,
        marginTop: GlobalStyles.spacing/2,
        justifyContent: 'space-between'
    }
});