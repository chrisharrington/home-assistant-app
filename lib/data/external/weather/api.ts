import { EXPO_PUBLIC_LATITUDE, EXPO_PUBLIC_LONGITUDE, EXPO_PUBLIC_TOMORROW_IO_API_KEY } from '@env';
import { WeatherIcons, Weather } from './models';
import { WrapResult, wrapFetch } from '@lib/data/wrap';

export function getWeather() : WrapResult<Weather> {
    return wrapFetch(`https://api.tomorrow.io/v4/weather/realtime?location=${EXPO_PUBLIC_LATITUDE},${EXPO_PUBLIC_LONGITUDE}&apikey=${EXPO_PUBLIC_TOMORROW_IO_API_KEY}`, {
        readModifier: json => {
            const values = json.data.values;
            return {
                temperature: values.temperature,
                feelsLike: values.temperatureApparent,
                icon: WeatherIcons[values.weatherCode]
            }
        }
    });
}