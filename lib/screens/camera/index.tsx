import React, { useRef } from 'react';
import { useContext, useEffect, useState } from 'react';
import { View, ScrollView, Image, ActivityIndicator, RefreshControl, Pressable, Text } from 'react-native';
import { EXPO_PUBLIC_FRIGATE_PASSWORD, EXPO_PUBLIC_FRIGATE_USER_NAME } from '@env';
import dayjs, { Dayjs } from 'dayjs';
import { StyleSheet } from '@lib/stylesheet';
import { StateContext } from '@lib/context';
import { FrigateEvent } from '@lib/models/frigate';
import { getEvents } from '@lib/data/frigate';
import colours from '@lib/colours';
import { Actions as VideoActions, VideoPlayer } from '@lib/components/video';
import Config from '@lib/config';
import { DateSelector } from './dateSelector';
import { useEntities } from '@lib/data/homeAssistant';
import { Camera } from '@lib/entities/camera';

type Props = {

}

export const CameraScreen = (props: Props) => {
    const { toast } = useContext(StateContext),
        cameraName = 'driveway',//props.route?.params?.cameraName,
        [events, setEvents] = useState<FrigateEvent[]>([]),
        [date, setDate] = useState<Dayjs>(dayjs()),
        [loading, setLoading] = useState<boolean>(false),
        [refreshing, setRefreshing] = useState<boolean>(false),
        [selected, setSelected] = useState<FrigateEvent | null>(null),

        videoRef = useRef<VideoActions>(null);

    useEffect(() => {
        load(true);
    }, [date]);

    return <View style={{ flex: 1 }}>
        <DateSelector
            date={date}
            loading={loading || refreshing}
            onDateChanged={setDate}
        />

        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={() => load(true)}
            />}
        >
            {loading ? <View style={styles.loader}>
                <ActivityIndicator
                    size={36}
                    color={colours.primary.hex()}
                />
            </View> : <View style={styles.list}>
                {events.map((event: FrigateEvent) => <Pressable
                    style={styles.event}
                    key={event.id}
                    onPress={() => setSelected(event)}
                >
                    <Image
                        style={styles.eventImage}
                        source={{ uri: `data:image/jpg;base64, ${event.thumbnail}`}}
                    />

                    <View style={styles.eventTimestampWrapper} />
                    <Text style={styles.eventTimestamp}>{dayjs.unix(event.start_time).format('hh:mm a')}</Text>
                    <Text style={styles.eventDuration}>{`${Math.round(dayjs.duration(dayjs.unix(event.end_time).diff(dayjs.unix(event.start_time))).asSeconds())} s`}</Text>
                </Pressable>)}
            </View>}
        </ScrollView>

        {selected && <VideoPlayer
            ref={videoRef}
            uri={`${Config.frigateBaseUrl}/api/events/${selected.id}/clip.mp4`}
            userName={EXPO_PUBLIC_FRIGATE_USER_NAME}
            password={EXPO_PUBLIC_FRIGATE_PASSWORD}
            controls={true}
            fullScreenOnLoad
            onFullScreenChanged={fullScreen => {
                if (!fullScreen && selected)
                    setSelected(null);
            }}
        />}
    </View>

    async function load(refresh: boolean = false) {
        try {
            if (refresh)
                setRefreshing(true);
            else {
                setEvents([]);
                setLoading(true);
            }

            const after = date.startOf('day').unix(),
                before = date.endOf('day').unix();

            setEvents(await getEvents(cameraName, after, before));
            setLoading(false);
            setRefreshing(false);
        } catch(e) {
            console.error(e);
            toast.error('An error has occurred while retrieving the list of events. Please try again later.');
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.background1.hex()
    },

    list: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    video: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'black',
        aspectRatio: 16 / 9
    },

    event: {
        width: '32.5%',
        height: 100,
        marginBottom: 5
    },

    eventImage: {
        width: '100%',
        height: '100%'
    },

    eventTimestampWrapper: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        left: 0,
        right: 0,
        opacity: 0.35,
        backgroundColor: 'black',
        height: 16
    },

    eventTimestamp: {
        position: 'absolute',
        zIndex: 3,
        top: 0,
        left: 0,
        right: 0,
        color: colours.text1.hex(),
        fontSize: 10,
        fontFamily: 'Lato Regular',
        textAlign: 'left',
        paddingLeft: 4
    },

    eventDuration: {
        position: 'absolute',
        zIndex: 3,
        top: 0,
        left: 0,
        right: 0,
        color: colours.text1.hex(),
        fontSize: 10,
        fontFamily: 'Lato Regular',
        textAlign: 'right',
        paddingRight: 4
    },

    loader: {
        marginTop: 150
    }
});