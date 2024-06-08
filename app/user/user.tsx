import React, { useEffect, useRef } from 'react';
import { Image, Pressable, ActivityIndicator, Animated, Easing } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { Person } from '@lib/entities';
import Config from '@lib/config';

type Props = {
    user: Person;
    loading: boolean;
    onSelect: (user: Person) => void;
}

export const User = ({ user, loading, onSelect } : Props) => {
    const loaderOpacity = useRef<Animated.Value>(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(loaderOpacity, {
            toValue: loading ? 0.65 : 0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();
    }, [loading]);

    return <Pressable
        style={styles.container}
        onPress={() => onSelect(user)}
    >
        <Image
            source={{ uri: Config.homeAssistantBaseUrl + user.attributes.entity_picture }}
            style={styles.image}
        />

        <Animated.View
            style={[
                styles.loaderContainer,
                { opacity: loaderOpacity }
            ]}
        />

        {loading && <ActivityIndicator
            size={36}
            color={colours.primary.hex()}
            style={styles.loader}
        />}
    </Pressable>;
}

const styles = StyleSheet.create({
    container: {
        width: 140,
        height: 140,
        marginBottom: 40
    },

    image: {
        flex: 1,
        borderRadius: 70,
        borderWidth: 1,
        borderColor: colours.text1.hex()
    },

    loaderContainer: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: colours.background1.hex()
    },

    loader: {
        position: 'absolute',
        zIndex: 3,
        top: '50%',
        left: '50%',
        transform: [{ translateX: -18 }, { translateY: -18 }]
    }
});