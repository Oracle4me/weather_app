import { getCurrentWeather } from '../api/weather-api.js';
import { initClouds } from './cloud.js';
import { initStorm, stopStorm } from './storm.js';

export async function initWeatherScene() {
    const weather = await getCurrentWeather();
    // console.log(weather);
    initClouds(weather.theme);

    if (
        weather.theme === 'storm' ||
        weather.theme === 'heavyStorm'
    ) {
        initStorm();
    } else {
        stopStorm();
    }
}