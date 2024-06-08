import React from 'react';
import { View, Text } from 'react-native';
import { Tile } from '@lib/components/tile';
import { StyleSheet } from '@lib/stylesheet';
import { CameraComponent } from './camera';

type Props = {
    cameraNames: string[];
}

export const Cameras = ({ cameraNames } : Props) => (
    <Tile>
        <View style={styles.container}>
            {cameraNames.map((cameraName: string) => (
                <CameraComponent
                    key={cameraName}
                    cameraName={cameraName}
                />
            ))}
        </View>
    </Tile>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15
    }
});