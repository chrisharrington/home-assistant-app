import React from 'react';
import { Pressable } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { Icon } from './icon';

type Props = {
    onPress: () => void;

    size?: number;
    containerStyle?: any;
    iconStyle?: (on: boolean) => any;
    antDesignIcon?: string;
    materialCommunityIcon?: string;
    disabled?: boolean;
};

export const IconButton = (props: Props) => {
    const iconProps = {
        size: props.size || 20,
        style: { color: props.disabled ? colours.text1.hex() : colours.background1.hex() }
    };

    return <Pressable
        style={({ pressed }) => [dynamicStyles.pressed(pressed), styles.container, props.containerStyle]}
        onPress={props.onPress}
    >
        <Icon
            antDesignIcon={props.antDesignIcon}
            materialCommunityIcon={props.materialCommunityIcon}
            {...iconProps}
        />
    </Pressable>;
};


const dynamicStyles = StyleSheet.dynamic({
    pressed: (pressed: boolean) => ({ opacity: pressed ? 0.5 : 1 })
});

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        overflow: 'hidden'
    },

    gradient: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
});