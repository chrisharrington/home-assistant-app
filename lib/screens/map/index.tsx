import React, { useRef } from 'react';
import { createRef, useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import Supercluster from 'supercluster';
import { EntityType } from '@lib/models/entity';
import { ScreenProps, StackNavigationProps } from '@lib/models/navigation';
import { Person } from '@lib/entities';
import colours from '@lib/colours';
import Config from '@lib/config';
import { CustomMarker } from './marker';
import { Selector } from './selector';
import MapStyle from './mapStyle.json';
import { useEntities } from '@lib/data/homeAssistant';

type MapProps = {
    navigation: StackNavigationProps;
} & ScreenProps<{ personName: string }>

type Cluster = {
    latitude: number;
    longitude: number;
    entityNames: string[];
}

export const MapScreen = (props: MapProps) => {
    const map = createRef<MapView>(),
        entities = useEntities(),
        people = entities.type<Person>(EntityType.Person),
        person = people.find(p => p.entity_id === props.route?.params?.personName) || people[0],
        [selectedPerson, setSelectedPerson] = useState<Person>(person),
        clusterIndex = useRef<Supercluster | null>(null),
        [clusters, setClusters] = useState<Cluster[]>([]);

    useEffect(() => {
        if (!people?.length)
            return;

        const index = new Supercluster({ radius: 75, maxZoom: 20 }),
            filtered = people.filter(p => p.attributes.latitude && p.attributes.longitude);

        index.load(filtered.map(p => ({
            type: 'Feature',
            properties: { name: p.entity_id },
            geometry: { type: 'Point', coordinates: [p.attributes.longitude, p.attributes.latitude] }
        })));

        clusterIndex.current = index;
    }, [people]);

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
            initialPerson={person}
            onPersonChanged={setSelectedPerson}
        />

        <MapView
            ref={map}
            initialRegion={{
                latitude: selectedPerson?.attributes.latitude || 0,
                longitude: selectedPerson?.attributes.longitude || 0,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }}
            customMapStyle={MapStyle}
            style={styles.map}
            onRegionChange={(region: Region) => updateClusters(region.longitudeDelta)}
            onMapReady={() => updateClusters()}
        >
            {clusters.map(renderMarker)}
        </MapView>
    </View>;

    function renderMarker(cluster: Cluster) {
        const width = cluster.entityNames.length * 44;
        if (cluster.entityNames.length === 1) {
            const person = entities.id<Person>(cluster.entityNames[0]);
            if (!person)
                throw new Error(`Unable to find person with name ${cluster.entityNames[0]}.`);

            return <CustomMarker
                key={person.entity_id}
                content={<Image style={styles.singleImage} source={{ uri: Config.homeAssistantBaseUrl + person.attributes.entity_picture }} />}
                latitude={person.attributes.latitude || 0}
                longitude={person.attributes.longitude || 0}
                width={width}
            />
        }

        const people = entities.list.filter(p => cluster.entityNames.includes(p.entity_id)) as Person[];
        return <CustomMarker
            key={cluster.entityNames.join(',')}
            content={<View style={[styles.cluster, { width: people.length * 44 }]}>
                {people.map(person => <Image
                    key={person.entity_id}
                    style={styles.clusterImage}
                    source={{ uri: Config.homeAssistantBaseUrl + person.attributes.entity_picture }}  
                />)}
            </View>}
            latitude={cluster.latitude}
            longitude={cluster.longitude}
            width={width}
        />;
    }

    async function updateClusters(longitudeDelta?: number) {
        if (!clusterIndex.current || !map.current)
            return;

        const bounds = await map.current.getMapBoundaries(),
            zoom = longitudeDelta ? Math.log2(360 * (Dimensions.get('window').width / 256 / longitudeDelta)) : 16;

        setClusters(clusterIndex.current.getClusters([
            bounds.southWest.longitude,
            bounds.southWest.latitude,
            bounds.northEast.longitude,
            bounds.northEast.latitude
        ], zoom).map(cluster => {
            const entityNames: string[] = cluster.properties.cluster_id ?
                clusterIndex.current?.getLeaves(cluster.properties.cluster_id).map(c => c.properties.name) || [] :
                [cluster.properties.name];

            return {
                latitude: cluster.geometry.coordinates[1],
                longitude: cluster.geometry.coordinates[0],
                entityNames
            };
        }));
    }   
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