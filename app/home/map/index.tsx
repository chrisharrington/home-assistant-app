import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet } from '@lib/stylesheet';
import Colours from '@lib/colours';
import { Tile } from '@lib/components/tile';
import { TileHeader } from '@lib/components/tileHeader';
import { useEntities } from '@lib/data/homeAssistant';
import { Person } from '@lib/entities';
import { EntityType } from '@lib/models';
import { Count } from '@lib/components/count';

type Props = {

}

export function Map({ }: Props) {
    const people = useEntities().type<Person>(EntityType.Person);
    return <Pressable>
        <Tile style={styles.container}>
            <TileHeader label='Map'>
                <Count
                    text={`${people.filter(p => p.state === 'home').length} / ${people.length}`}
                    icon={<FontAwesome6 name='house-chimney' size={14} color={Colours.primary.hex()} />}
                />
            </TileHeader>
        </Tile>
    </Pressable>;

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    homeCount: {

    }
});