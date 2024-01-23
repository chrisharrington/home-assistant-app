import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Portal } from '@gorhom/portal';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';

type Props = {
    visible: boolean;
} & PropsWithChildren;

export const SlideUp = ({ visible, children } : Props) => {
    const shadeOpacity = useRef(new Animated.Value(0)).current,
        menuPosition = useRef(new Animated.Value(100)).current,
        menuHeight = useRef(0);

    useEffect(() => {
        Animated.timing(shadeOpacity, {
            toValue: visible ? 0.7 : 0,
            duration: 150,
            useNativeDriver: true
        }).start();

        Animated.timing(menuPosition, {
            toValue: visible ? 0 : (menuHeight.current === 0 ? 1000 : menuHeight.current),
            duration: 150,
            useNativeDriver: true
        }).start();
    }, [visible]);
    
    return <Portal>
        <Animated.View
            style={[styles.shade, { pointerEvents: visible ? 'auto' : 'none', opacity: shadeOpacity }]}
        />

        <Animated.View
            style={[styles.menu, { pointerEvents: visible ? 'auto' : 'none', transform: [{ translateY: menuPosition }]} ]}
            onLayout={event => menuHeight.current = event.nativeEvent.layout.height}
        >
            {children}
        </Animated.View>
    </Portal>;
}

const styles = StyleSheet.create({
    menu: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 3,
        backgroundColor: colours.background1.hex(),
        color: colours.text1.hex()
    },

    shade: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 2,
        backgroundColor: 'black'
    }
});