import { StyleSheet } from '@lib/stylesheet';
import React from 'react';
import { Image } from 'react-native';

export type Weather = {
    temperature: number;
    feelsLike: number;
    icon: React.ReactNode;
}

const styles = StyleSheet.create({
    icon: {
        width: 36,
        height: 36,
        marginBottom: 1,
        marginRight: 16
    },

    iconAlt: {
        width: 30,
        height: 30,
        marginBottom: 4,
        marginRight: 16
    },
});

export const WeatherIcons: { [key: number] : React.ReactNode } = {
    1000: <Image source={require('@assets/icons/tomorrow-weather/1000.png')} style={styles.iconAlt} />,
    1001: <Image source={require('@assets/icons/tomorrow-weather/1001.png')} style={styles.iconAlt} />,
    1100: <Image source={require('@assets/icons/tomorrow-weather/1100.png')} style={styles.iconAlt} />,
    1101: <Image source={require('@assets/icons/tomorrow-weather/1101.png')} style={styles.iconAlt} />,
    1102: <Image source={require('@assets/icons/tomorrow-weather/1102.png')} style={styles.iconAlt} />,
    2000: <Image source={require('@assets/icons/tomorrow-weather/2000.png')} style={styles.iconAlt} />,
    2100: <Image source={require('@assets/icons/tomorrow-weather/2100.png')} style={styles.iconAlt} />,
    4000: <Image source={require('@assets/icons/tomorrow-weather/4000.png')} style={styles.iconAlt} />,
    4001: <Image source={require('@assets/icons/tomorrow-weather/4001.png')} style={styles.iconAlt} />,
    4200: <Image source={require('@assets/icons/tomorrow-weather/4200.png')} style={styles.iconAlt} />,
    4201: <Image source={require('@assets/icons/tomorrow-weather/4201.png')} style={styles.iconAlt} />,
    5000: <Image source={require('@assets/icons/tomorrow-weather/5000.png')} style={styles.iconAlt} />,
    5001: <Image source={require('@assets/icons/tomorrow-weather/5001.png')} style={styles.iconAlt} />,
    5100: <Image source={require('@assets/icons/tomorrow-weather/5100.png')} style={styles.iconAlt} />,
    5101: <Image source={require('@assets/icons/tomorrow-weather/5101.png')} style={styles.iconAlt} />,
    6000: <Image source={require('@assets/icons/tomorrow-weather/6000.png')} style={styles.iconAlt} />,
    6001: <Image source={require('@assets/icons/tomorrow-weather/6001.png')} style={styles.iconAlt} />,
    6200: <Image source={require('@assets/icons/tomorrow-weather/6200.png')} style={styles.iconAlt} />,
    7000: <Image source={require('@assets/icons/tomorrow-weather/7000.png')} style={styles.iconAlt} />,
    7101: <Image source={require('@assets/icons/tomorrow-weather/7101.png')} style={styles.iconAlt} />,
    7102: <Image source={require('@assets/icons/tomorrow-weather/7102.png')} style={styles.iconAlt} />,
    8000: <Image source={require('@assets/icons/tomorrow-weather/8000.png')} style={styles.iconAlt} />
}