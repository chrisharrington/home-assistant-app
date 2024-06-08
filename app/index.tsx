import React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';

export default function() {
    return <Redirect href='home' />;
}