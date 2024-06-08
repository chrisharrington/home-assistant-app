import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { Person } from '@lib/entities/person';
import Config from '@lib/config';

type Props = {
    people: Person[];
    onPersonChanged: (person: Person) => void;
    initialPerson?: Person;
}

export const Selector = ({ people, onPersonChanged, initialPerson } : Props) => {
    if (!people.length)
        return null;

    const [personIndex, setPersonIndex] = useState<number>(0);

    useEffect(() => {
        onPersonChanged(people[personIndex]);
    }, [personIndex]);

    useEffect(() => {
        if (!initialPerson)
            return;

        setPersonIndex(people.findIndex(p => p.entity_id === initialPerson.entity_id))
    }, [initialPerson]);

    const person = people[personIndex];
    return <View style={styles.container}>
        <View style={styles.buttons}>
            <Pressable
                style={styles.arrow}
                onPress={() => changePersonIndex(personIndex - 1)}
            >
                <MaterialIcons
                    name='chevron-left'
                    size={24}
                    color={colours.primary.hex()}
                />
            </Pressable>

            <Pressable
                style={styles.person}
                onPress={() => onPersonChanged(person)}
            >
                <Image
                    style={styles.picture}
                    source={{ uri: `${Config.homeAssistantBaseUrl}${person.attributes.friendly_name}` }}
                />

                <View style={styles.labelsContainer}>
                    <Text style={styles.name}>{person.attributes.friendly_name}</Text>
                    <Text style={styles.location}>{getLocation(person)}</Text>
                </View>
            </Pressable>

            <Pressable
                style={styles.arrow}
                onPress={() => changePersonIndex(personIndex + 1)}
            >
                <MaterialIcons
                    name='chevron-right'
                    size={24}
                    color={colours.primary.hex()}
                />
            </Pressable>
        </View>
    </View>;

    function changePersonIndex(index: number) {
        if (index > people.length - 1)
            index = 0;
        else if (index < 0)
            index = people.length - 1;
        setPersonIndex(index);
    }

    function getLocation(person: Person) {
        switch (person.state) {
            case 'not_home':
                return '-';
            case 'home':
                return 'Home'
            default:
                return person.state.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        padding: 20,
        backgroundColor: colours.background2.hex(),
        elevation: 3
    },

    buttons: {
        flexDirection: 'row',
        gap: 10
    },

    person: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'center'
    },

    picture: {
        alignSelf: 'center',
        width: 42,
        height: 42,
        borderRadius: 42
    },

    labelsContainer: {
        flex: 1,
        marginLeft: 14,
        alignSelf: 'center'
    },

    name: {
        color: colours.text1.hex(),
        fontSize: 18,
        fontFamily: 'Lato Regular'
    },

    location: {
        color: colours.primary.hex(),
        fontSize: 13,
        fontFamily: 'Open Sans',
        marginTop: 2
    },

    arrow: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colours.background1.hex(),
        borderRadius: 4
    }
});