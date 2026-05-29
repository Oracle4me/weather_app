function flickerCityLights() {
    gsap.to('.cityscape-night-overlay', {
        opacity: Math.random() * 0.7 + 0.2,
        duration: Math.random() * 0.5 + 0.15,
        ease: "sine.inOut",
        onComplete: flickerCityLights
    });
}

export function updateBackgroundByTime() {
    const hour = new Date().getHours();

    const cityBg = document.querySelector('.cityscape-bg');
    const lights = document.querySelector('.cityscape-night-overlay');

    const isNight = hour >= 18 || hour < 6;

    cityBg.style.backgroundImage = isNight
        ? "url('assets/city_night.png')"
        : "url('assets/city_light.png')";

    lights.style.display = isNight ? 'block' : 'none';

    if (isNight) {
        lights.style.visibility = 'visible';
        lights.style.opacity = '1';
        
        flickerCityLights();
    } else {
         lights.style.visibility = 'hidden';
        lights.style.opacity = '0';
        gsap.killTweensOf('.cityscape-night-overlay');
    }
}