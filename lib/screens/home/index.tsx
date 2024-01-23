import React from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import { Person } from '@lib/entities';
import { EntityType } from '@lib/models/entity';
import colours from '@lib/colours';
import { People } from './people';
import { Cameras } from './cameras';
import { Investments } from './investments';
import { Quote } from './quote';
import { useEntities } from '@lib/data/homeAssistant';
import { Header } from './header';
import { Floor } from './floor';
import { Climate } from '@lib/entities/climate';

export const HomeScreen = () => {
    const entities = useEntities(),
        climateDownstairs = entities.id<Climate>('climate.downstairs'),
        climateUpstairs = entities.id<Climate>('climate.upstairs');

    return <ScrollView style={styles.container} contentContainerStyle={{ gap: 15, padding: 15 }}>
        <Header />
        <Quote />

        <Floor
            name='Basement'
            entityIds={[
                'switch.basement_bar',
                'switch.basement_chandelier',
                'switch.basement_hallway',
                'switch.basement_exterior',
                'switch.basement_fireplace',
                'switch.office_heater',
                'switch.basement_furnace_room',
                'light.office',
                'light.basement_pot_lights'
            ]}
            temperature={climateDownstairs?.attributes.current_temperature || 0}
            humidity={climateDownstairs?.attributes.current_humidity || 0}
            onPress={() => {}}
        />
        
        {/* <Floor
            name='Main Floor'
            entityIds={[]}
            temperature={climateDownstairs?.attributes.current_temperature || 0}
            humidity={climateDownstairs?.attributes.current_humidity || 0}
            onPress={() => {}}
        />
        
        <Floor
            name='Upstairs'
            entityIds={[]}
            temperature={climateUpstairs?.attributes.current_temperature || 0}
            humidity={climateUpstairs?.attributes.current_humidity || 0}
            onPress={() => {}}
        /> */}
        
        <People people={entities.type<Person>(EntityType.Person)} />
        <Cameras cameraNames={['driveway', 'backyard']} />
        {/* <Investments /> */}
    </ScrollView>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.background1.hex()
    }
});