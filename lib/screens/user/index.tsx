import React, { useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { GlobalStyles } from '@lib/styles';
import { useEntities } from '@lib/data/homeAssistant';
import { Person } from '@lib/entities';
import { EntityType, StackNavigationProps } from '@lib/models';
import { User } from './user';
import { useNavigation } from '@react-navigation/native';
import { useSession } from '@lib/common/session';
import { StateContext } from '@lib/context';

export const UserScreen = () => {
    const users = useEntities().type<Person>(EntityType.Person),
        { setUser } = useSession(),
        { navigate } = useNavigation<StackNavigationProps>(),
        [loading, setLoading] = useState<string | null>(null),
        { toast } = useContext(StateContext);
        
    return <View style={styles.container}>
        <Text style={styles.who}>Who are you?</Text>

        <View style={styles.users}>
            {users.map(user => <User
                key={user.entity_id}
                user={user}
                loading={user.entity_id === loading}
                onSelect={onSelect}
            />)}
        </View>
    </View>;

    async function onSelect(user: Person) {
        if (loading)
            return;

        try {
            setLoading(user.entity_id);
            await setUser(user);
            navigate('Home', {});
        } catch (e) {
            toast.error('An error has occurred while selecting the user. Please try again later.');
            console.error(e);
        } finally {
            setLoading(null);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.background1.hex(),
        padding: GlobalStyles.spacing
    },

    who: {
        color: colours.text1.hex(),
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'Lato Regular',
        marginTop: 80
    },

    users: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: 60
    }
});