import { BaseEntity } from '../base';

export type Climate = BaseEntity & {
    attributes: {
        current_humidity: number;
        current_temperature: number;
        fan_mode: string;
        fan_modes: string[];
        friendly_name: string;
        hvac_action: 'idle';
        hvac_modes: string[];
        max_temp: number;
        min_temp: number;
        supported_features: number;
        target_temp_high: number | null;
        target_temp_low: number | null;
        temperature: number;
    }
}