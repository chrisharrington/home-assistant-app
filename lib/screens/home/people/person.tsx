import React from 'react';
import { Pressable, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Person } from '@lib/entities';
import { StackNavigationProps } from '@lib/models/navigation';
import Config from '@lib/config';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';

type Props = {
    person: Person;
}

export const PersonComponent = ({ person } : Props) => {
    const navigation = useNavigation<StackNavigationProps>();

    return <Pressable
        key={person.entity_id}
        style={({ pressed }) => [styles.person, { opacity: pressed ? 0.7 : 1 }]}
        onPress={() => navigation.navigate('Map', { personName: person.entity_id })}
    >
        <Image
            style={styles.image}
            source={{ uri: Config.homeAssistantBaseUrl + person.attributes.entity_picture }}
        />

        <View
            style={[styles.status, person.attributes.friendly_name === 'Home' ? styles.statusHome : styles.statusAway]}
        />
    </Pressable>;
}

const styles = StyleSheet.create({
    person: {
        flex: 1
    },

    image: {
        borderRadius: 4,
        width: 68,
        height: 68,
        borderWidth: 1,
        borderColor: colours.background1.hex(),
        alignSelf: 'center',
        marginVertical: 15
    },

    status: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 11,
        height: 11,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colours.primary.hex()
    },

    statusHome: {
        backgroundColor: colours.primary.hex()
    },

    statusAway: {
        backgroundColor: colours.background1.hex()
    }
});