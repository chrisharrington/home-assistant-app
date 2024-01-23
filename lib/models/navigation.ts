import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type StackParamsList = {
    'Home': {},
    'Map': { personName: string },
    'Camera': { cameraName: string },
    'User': {}
}

export type StackNavigationProps = NativeStackNavigationProp<StackParamsList>;

export type ScreenProps<Params> = {
    route: {
        name: string;
        params: Params
    }
}