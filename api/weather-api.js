const BMKG_API = 'https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=33.74.07.1008';

function mapWeatherCode(code) {
    if (code >= 95) {
        return 'heavyStorm';
    }

    if (
        code === 60 ||
        code === 61 ||
        code === 63 ||
        code === 80 ||
        code === 81
    ) {
        return 'storm';
    }

    if (code === 45) {
        return 'fog';
    }

    if (code === 2 || code === 3) {
        return 'sunset';
    }

    return 'day';
}

function getTimeTheme(hour, weatherType) {
    if (
        weatherType === 'storm' ||
        weatherType === 'heavyStorm' ||
        weatherType === 'fog'
    ) {
        return weatherType;
    }

    if (hour >= 18 || hour <= 5) {
        return 'night';
    }

    if (hour >= 16 && hour < 18) {
        return 'sunset';
    }

    return 'day';
}

export async function getCurrentWeather() {
    try {
        const response = await fetch(BMKG_API);
        const json = await response.json();

        const current =
            json.data[0].cuaca.flat()[0];

        const weatherCode = current.weather;

        const localTime = new Date(
            current.local_datetime
        );

        const hour = localTime.getHours();

        const weatherType =
            mapWeatherCode(weatherCode);

        const theme =
            getTimeTheme(hour, weatherType);

        return {
            code: weatherCode,
            desc: current.weather_desc,
            temp: current.t,
            humidity: current.hu,
            rainChance: current.tp,
            theme
        };
    } catch (err) {
        console.error('Weather API failed:', err);

        return {
            theme: 'day'
        };
    }
}