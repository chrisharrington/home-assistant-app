import React from 'react';
import { View, Text, ActivityIndicator, Image, Pressable } from 'react-native';
import dayjs from 'dayjs';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { getWeather } from '@lib/data/external/weather';
import { LoaderBoundary } from '@lib/components/loaderBoundary';
import { useSession } from '@lib/common/session';
import Config from '@lib/config';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProps } from '@lib/models';

const weatherResource = getWeather();

export const Header = () => {
    const { session } = useSession(),
        { navigate } = useNavigation<StackNavigationProps>();

    return <View style={styles.container}>
        <Pressable style={styles.user} onPress={() => navigate('User', {})}>
            {session ? <Image
                source={{ uri: Config.homeAssistantBaseUrl + session.attributes.entity_picture }}
                style={styles.userImage}
            /> : <ActivityIndicator size={24} color={colours.primary.hex()} />}
        </Pressable>

        <View style={styles.datetime}>
            <Text style={styles.date}>{dayjs().format('MMMM Do YYYY')}</Text>
            <Text style={styles.time}>{dayjs().format('HH:mm')}</Text>
        </View>

        <View style={styles.weather}>
            <LoaderBoundary
                loadingFallback={<ActivityIndicator style={styles.weatherLoader} size={24} color={colours.primary.hex()} />}
                errorFallback={<Text style={styles.weatherFallback}>An error has occurred while retrieving the weather.</Text>}
            >
                <Weather />
            </LoaderBoundary>
        </View>
    </View>;

    function Weather() {
        const weatherResult = weatherResource.read();
        return <View style={styles.weather}>
            {weatherResult.icon}
            <Text style={styles.weatherTemperature}>{`${Math.round(weatherResult.temperature)}°`}</Text>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },

    user: {
        flexBasis: 56,
        marginRight: 14,
        alignContent: 'center',
        justifyContent: 'center'
    },

    userImage: {
        width: 56,
        height: 56,
        borderRadius: 56 / 2,
        borderWidth: 1,
        borderColor: colours.text3.hex()
    },

    datetime: {
        flex: 1
    },

    date: {
        fontSize: 16,
        fontFamily: 'Lato Regular',
        color: colours.text2.hex()
    },

    time: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Lato Regular',
        color: colours.text1.hex()
    },

    weather: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingBottom: 2
    },

    weatherTemperature: {
        color: colours.text1.hex(),
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Lato Regular',
        textAlign: 'center'
    },

    weatherLoader: {
        marginRight: 14,
        marginBottom: 4
    },

    weatherFallback: {
        color: colours.text1.hex()
    }
});