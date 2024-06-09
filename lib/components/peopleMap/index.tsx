import React, { useMemo, useRef } from 'react';
import { createRef, useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import Supercluster from 'supercluster';
import { Person } from '@lib/entities';
import colours from '@lib/colours';
import Config from '@lib/config';
import { CustomMarker } from './marker';
import MapStyle from './mapStyle.json';
import { useEntities } from '@lib/data/homeAssistant';
import { GlobalStyles } from '@lib/styles';

type Props = {
    people: Person[];
}

type Cluster = {
    latitude: number;
    longitude: number;
    entityNames: string[];
}

export function PeopleMap({ people }: Props) {
    const map = createRef<MapView>(),
        entities = useEntities(),
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

    const region = useMemo(() => {
        if (!people?.length)
            return { latitude: 0, longitude: 0, latitudeDelta: 0.1, longitudeDelta: 0.1 };

        const minLat = Math.min(...people.map(p => p.attributes.latitude || 0)),
            maxLat = Math.max(...people.map(p => p.attributes.latitude || 0)),
            minLong = Math.min(...people.map(p => p.attributes.longitude || 0)),
            maxLong = Math.max(...people.map(p => p.attributes.longitude || 0));

        return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLong + maxLong) / 2,
            latitudeDelta: maxLat - minLat + 0.005,
            longitudeDelta: maxLong - minLong + 0.005
        };
    }, [people]);

    return <View style={styles.container}>
        <MapView
            ref={map}
            initialRegion={region}
            customMapStyle={MapStyle}
            style={styles.map}
            zoomEnabled={false}
            scrollEnabled={false}
            onRegionChange={(region: Region) => updateClusters(region.longitudeDelta)}
            onMapReady={() => updateClusters()}
        >
            {clusters.map(renderMarker)}
        </MapView>
    </View>;

    function renderMarker(cluster: Cluster) {
        if (cluster.entityNames.length === 1) {
            const person = entities.id<Person>(cluster.entityNames[0]);
            if (!person)
                throw new Error(`Unable to find person with name ${cluster.entityNames[0]}.`);

            return <CustomMarker
                key={person.entity_id}
                content={<Image style={styles.singleImage} source={{ uri: Config.homeAssistantBaseUrl + person.attributes.entity_picture }} />}
                latitude={person.attributes.latitude || 0}
                longitude={person.attributes.longitude || 0}
                width={44}
            />
        }

        const people = entities.list.filter(p => cluster.entityNames.includes(p.entity_id)) as Person[],
            width = (people.length + 1) * 22;

        return <CustomMarker
            key={cluster.entityNames.join(',')}
            content={<View style={[styles.cluster, { width: (people.length + 1) * 22 }]}>
                {people.map((person, index) => <Image
                    key={person.entity_id}
                    style={[styles.clusterImage, { left: index * 22 }]}
                    source={{ uri: Config.homeAssistantBaseUrl + person.attributes.entity_picture }}
                />)}
            </View>}
            latitude={cluster.latitude}
            longitude={cluster.longitude}
            width={width + 1}
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
        height: 300,
        backgroundColor: colours.background1.hex(),
        borderRadius: GlobalStyles.borderRadius,
        overflow: 'hidden',
        marginTop: 10
    },

    map: {
        width: '100%',
        height: '100%',
        borderRadius: GlobalStyles.borderRadius
    },

    singleImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 44,
        height: 44,
        borderColor: colours.background1.hex(),
        borderWidth: 1,
        borderRadius: 22
    },

    cluster: {
        position: 'absolute',
        top: 2,
        left: 0,
        height: 44,
        borderColor: colours.background1.hex(),
        borderRadius: 22,
        backgroundColor: colours.background1.hex()
    },

    clusterImage: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: colours.background1.hex(),
        top: 0,
        width: 44,
        height: 44,
        borderRadius: 20
    }
});