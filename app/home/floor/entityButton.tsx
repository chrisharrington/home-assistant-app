import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import dayjs from 'dayjs';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { GlobalStyles } from '@lib/styles';
import { BaseEntity } from '@lib/entities/base';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { service } from '@lib/data/homeAssistant';
import { LightOn, SwitchOff, SwitchOn } from '@lib/data/commands';
import { Command, EntityType } from '@lib/models';
import { LightOff } from '@lib/data/commands/light';
import { StateContext } from '@lib/context';

dayjs.extend(relativeTime);

type Props = {
    entity: BaseEntity;
}

export const EntityButton = ({ entity } : Props) => {
    const [loading, setLoading] = useState<boolean>(false),
        state = entity.state === 'on',
        { toast } = useContext(StateContext);

    return entity ? <Pressable
        style={[styles.container, state && styles.containerActive]}
        onPress={onPress}
    >
        <View style={styles.description}>
            <Text style={[styles.name, state && styles.nameActive]} numberOfLines={1}>{entity.attributes.friendly_name}</Text>
            <Text style={[styles.timestamp, state && styles.timestampActive]}>{dayjs(entity.last_updated).fromNow(true)}</Text>
        </View>

        <View style={styles.iconContainer}>
            {getIconFromEntity(entity)}
        </View>
    </Pressable> : <></>;

    function getIconFromEntity(entity: BaseEntity) {
        const colour = state ? colours.background1.hex() : colours.text1.hex();
        if (loading)
            return <ActivityIndicator size={20} color={colour} />;
            
        switch (entity.attributes.icon) {
            case 'mdi:lightbulb':
            case 'mdi:lightbulb-group':
                return <MaterialCommunityIcons name='lightbulb-outline' size={20} color={colour} />;
            case 'mdi:fireplace':
                return <MaterialCommunityIcons name='fireplace' size={20} color={colour} />;
            case 'mdi:radiator':
                return <MaterialCommunityIcons name='radiator' size={20} color={colour} />;
            default:
                return <></>;
        }
    }
    
    async function onPress() {
        try {
            const type = entity.entity_id.split('.')[0];
            let command: Command | null = null;
            switch (type) {
                case EntityType.Light:
                    command = state ? new LightOff(entity.entity_id) : new LightOn(entity.entity_id);
                    break;
                case EntityType.Switch:
                    command = state ? new SwitchOff(entity.entity_id) : new SwitchOn(entity.entity_id);
                    break;
                default:
                    
            }

            if (!command)
                throw new Error(`Unable to issue command: No handler for entity type ${type}.`);

            setLoading(true);
            await service(command);
        } catch (e) {
            console.error(e);
            toast.error('An error occurred while toggling this entity. Please try again later.');
        } finally {
            setLoading(false);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexBasis: 150,
        flexGrow: 1,
        flexDirection: 'row',
        borderRadius: GlobalStyles.borderRadius,
        paddingVertical: GlobalStyles.spacing*3/4,
        paddingLeft: GlobalStyles.spacing,
        paddingRight: GlobalStyles.spacing - 4,
        backgroundColor: colours.background1.hex()
    },

    containerActive: {
        backgroundColor: colours.text2.hex(),
    },

    description: {
        flex: 1
    },

    name: {
        flex: 1,
        color: colours.text1.hex(),
        fontSize: 16
    },

    nameActive: {
        color: colours.background1.hex()
    },

    timestamp: {
        flex: 1,
        color: colours.text3.hex(),
        fontSize: 12,
        fontStyle: 'italic'
    },

    timestampActive: {
        color: colours.background1.hex()
    },
    
    iconContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center'
    }
});