import { ImageStyle, TextStyle, ViewStyle } from 'react-native';


type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };
type FunctionStyles = { [key: string]: (toggle: boolean) => ViewStyle | TextStyle | ImageStyle };

export const StyleSheet = {
    create: <T extends NamedStyles<T> | NamedStyles<any>>(styles: T | NamedStyles<T>): T => styles as T,
    dynamic: <T extends NamedStyles<T> | NamedStyles<any>>(styles: FunctionStyles): FunctionStyles => styles as FunctionStyles
};