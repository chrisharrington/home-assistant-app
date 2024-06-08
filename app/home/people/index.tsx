import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import { Person } from '@lib/entities';
import colours from '@lib/colours';
import { PersonComponent } from './person';

type Props = {
    people: Person[];
}

export const People = ({ people } : Props) => (
    <View style={styles.container}>
        {people.map((person: Person) => (
            <PersonComponent
                key={person.entity_id}
                person={person}
            />
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 4,
        overflow: 'hidden',
        gap: 1,
        backgroundColor: colours.background2.hex()
    },

    person: {
        flex: 1,
        backgroundColor: colours.background1.hex(),
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 4
    },

    image: {
        borderRadius: 40,
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: colours.text3.hex(),
        alignSelf: 'center',
    },

    locationContainer: {
        justifyContent: 'center',
        height: 35
    },

    location: {
        color: colours.primary.hex(),
        fontSize: 10,
        textAlign: 'center',
        marginTop: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
});