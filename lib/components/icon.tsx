import React from 'react';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type Props = {
    size?: number;
    style?: any;
    antDesignIcon?: string;
    materialCommunityIcon?: string;
    materialIcon?: string;
};

export const Icon = (props: Props) => {
    const iconProps = {
        size: props.size || 28,
        style: props.style
    };

    return props.antDesignIcon ? <AntDesign
        name={props.antDesignIcon as any}
        {...iconProps}
    /> : props.materialCommunityIcon ? <MaterialCommunityIcons
        name={props.materialCommunityIcon as any}
        {...iconProps}
    /> : props.materialIcon ? <MaterialIcons
        name={props.materialIcon as any}
        {...iconProps}
    /> : null;
}