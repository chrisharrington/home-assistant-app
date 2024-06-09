import React from 'react';
import { createRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { EntityType } from '@lib/models/entity';
import { Person } from '@lib/entities';
import colours from '@lib/colours';
import { Selector } from './selector';
import { useEntities } from '@lib/data/homeAssistant';

type MapProps = {

}

type Cluster = {
    latitude: number;
    longitude: number;
    entityNames: string[];
}

export const MapScreen = (props: MapProps) => {
    const map = createRef<MapView>(),
        entities = useEntities(),
        people = entities.type<Person>(EntityType.Person),
        [selectedPerson, setSelectedPerson] = useState<Person>(people[0]);

    useEffect(() => {
        if (!selectedPerson)
            return;

        map.current?.animateToRegion({
            latitude: selectedPerson.attributes.latitude || 0,
            longitude: selectedPerson.attributes.longitude || 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        });
    }, [selectedPerson]);

    useEffect(() => {
        if (!selectedPerson)
            return;

        const p = people.find(p => p.entity_id === selectedPerson.entity_id);
        if (p && selectedPerson.entity_id !== p.entity_id)
            setSelectedPerson(p);

    }, [people.length]);

    return <View>
        <Selector
            people={people}
            initialPerson={people[0]}
            onPersonChanged={setSelectedPerson}
        />

        {/* map here */}
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.background1.hex()
    },

    map: {
        width: '100%',
        height: '100%'
    },

    singleImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 44,
        height: 44,
        borderColor: colours.background3.hex(),
        borderWidth: 2,
        borderRadius: 4
    },

    cluster: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 44,
        borderColor: colours.background3.hex(),
        borderWidth: 2,
        borderRadius: 4,
        backgroundColor: colours.background3.hex(),
        flexDirection: 'row',
        gap: 2
    },

    clusterImage: {
        flex: 1,
        width: 40,
        height: 40,
        borderRadius: 4
    }
});