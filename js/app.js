import { startCalendarSchedular } from "./calendar.js";
import { initClouds } from "./cloud.js";
import { initStorm } from "./storm.js";
import { updateBackgroundByTime } from "./background.js";
import { initHolidayAPI } from "../api/holiday-api.js";
import { initWeatherScene } from "./weather-engine.js";


document.addEventListener('DOMContentLoaded', async () => {
    updateBackgroundByTime();
    await initHolidayAPI();
    await startCalendarSchedular();
    initWeatherScene();
});