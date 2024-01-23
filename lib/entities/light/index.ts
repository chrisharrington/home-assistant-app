import { HassEntity } from 'home-assistant-js-websocket';
import { BaseEntity } from '../base';

export type Light = BaseEntity & {
    attributes: {
        min_color_temp_kelvin: number;
        max_color_temp_kelvin: number;
        min_mireds: number;
        max_mireds: number;
        supported_color_modes: string[];
        color_mode: string;
        brightness: number;
        color_temp_kelvin: number;
        color_temp: number;
        hs_color: number[];
        rgb_color: number[];
        xy_color: number[];
        mode: string;
        dynamics: string;
        supported_features: number;
        friendly_name: string;
    }
} & Omit<HassEntity, 'attributes'>;