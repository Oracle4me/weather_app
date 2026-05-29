
const STORM_CONFIG = {
    rain: {
        count: 500,
        angleDeg: 25,
        minSpeed: 8,
        maxSpeed: 26,
        minLength: 20,
        maxLength: 60,
        minOpacity: 0.15,
        maxOpacity: 0.65,
        minThickness: 0.5,
        maxThickness: 1.8
    },

    lightning: {
        minInterval: 4000,
        maxInterval: 16000
    },

    thunder: {
        minDelay: 700,
        maxDelay: 2500,
        volume: 0.35
    }
};

let rainCanvas;
let rainCtx;
let rainDrops = [];
let thunderAudio;
let stormStarted = false;

const RAIN_ANGLE =
    STORM_CONFIG.rain.angleDeg * Math.PI / 180;


export function initStorm() {
    if (stormStarted) return;

    stormStarted = true;

    createRainCanvas();
    createLightningOverlay();
    // createThunderAudio();

    generateRainDrops(STORM_CONFIG.rain.count);

    animateRain();
    scheduleLightning();

    window.addEventListener('resize', handleResize);
}


function createRainCanvas() {
    rainCanvas = document.createElement('canvas');
    rainCanvas.id = 'rainCanvas';

    Object.assign(rainCanvas.style, {
        position: 'fixed',
        inset: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '20'
    });

    document.body.appendChild(rainCanvas);

    rainCtx = rainCanvas.getContext('2d');

    resizeRainCanvas();
}

function resizeRainCanvas() {
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
}

function handleResize() {
    resizeRainCanvas();
    generateRainDrops(STORM_CONFIG.rain.count);
}


function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function generateRainDrops(count) {
    rainDrops = [];

    for (let i = 0; i < count; i++) {
        const length = randomBetween(
            STORM_CONFIG.rain.minLength,
            STORM_CONFIG.rain.maxLength
        );

        rainDrops.push({
            x: Math.random() * rainCanvas.width,
            y: Math.random() * rainCanvas.height,

            speed: randomBetween(
                STORM_CONFIG.rain.minSpeed,
                STORM_CONFIG.rain.maxSpeed
            ),

            length,

            opacity: randomBetween(
                STORM_CONFIG.rain.minOpacity,
                STORM_CONFIG.rain.maxOpacity
            ),

            thickness: randomBetween(
                STORM_CONFIG.rain.minThickness,
                STORM_CONFIG.rain.maxThickness
            ),

            dx: Math.sin(RAIN_ANGLE) * length,
            dy: Math.cos(RAIN_ANGLE) * length
        });
    }
}

function animateRain() {
    rainCtx.clearRect(
        0,
        0,
        rainCanvas.width,
        rainCanvas.height
    );

    rainCtx.globalCompositeOperation = 'screen';

    for (const drop of rainDrops) {
        drawRainDrop(drop);
        moveRainDrop(drop);
        recycleRainDrop(drop);
    }

    requestAnimationFrame(animateRain);
}

function drawRainDrop(drop) {
    rainCtx.beginPath();

    rainCtx.moveTo(drop.x, drop.y);

    rainCtx.lineTo(
        drop.x - drop.dx,
        drop.y + drop.dy
    );

    rainCtx.strokeStyle =
        `rgba(255,255,255,${drop.opacity})`;

    rainCtx.lineWidth = drop.thickness;
    rainCtx.stroke();
}

function moveRainDrop(drop) {
    drop.x -= Math.sin(RAIN_ANGLE) * drop.speed;
    drop.y += Math.cos(RAIN_ANGLE) * drop.speed;
}

function recycleRainDrop(drop) {
    if (
        drop.y > rainCanvas.height + 50 ||
        drop.x < -100
    ) {
        drop.x = Math.random() * rainCanvas.width + 100;
        drop.y = -50;
    }
}


function createLightningOverlay() {
    const flash = document.createElement('div');
    flash.id = 'lightningFlash';

    Object.assign(flash.style, {
        position: 'fixed',
        inset: '0',
        background: '#fff',
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '25',
        mixBlendMode: 'screen'
    });

    document.body.appendChild(flash);
}

function flashLightning(power = 1, duration = 100) {
    const flash =
        document.getElementById('lightningFlash');

    const city =
        document.querySelector('.cityscape-bg');

    const clouds =
        document.getElementById('cloudsLayer');

    flash.style.opacity = power;

    if (city) {
        city.style.filter = `
            brightness(${1 + power * 2.2})
            contrast(${1 + power})
            grayscale(${power * 0.55})
        `;
    }

    if (clouds) {
        clouds.style.filter = `
            brightness(${1 + power * 2})
            grayscale(${power * 0.45})
        `;
    }

    document.body.style.filter = `
        grayscale(${power * 0.25})
        brightness(${1 + power * 0.35})
    `;

    setTimeout(() => {
        flash.style.opacity = 0;

        if (city) city.style.filter = 'none';
        if (clouds) clouds.style.filter = 'none';

        document.body.style.filter = 'none';
    }, duration);
}

function lightningStrike() {
    flashLightning(0.35, 50);

    setTimeout(() => {
        flashLightning(1, 100);
    }, 120);

    setTimeout(() => {
        flashLightning(0.55, 60);
    }, 240);

    playThunder();
}

function scheduleLightning() {
    const nextStrike = randomBetween(
        STORM_CONFIG.lightning.minInterval,
        STORM_CONFIG.lightning.maxInterval
    );

    setTimeout(() => {
        lightningStrike();
        scheduleLightning();
    }, nextStrike);
}

// ===============================
// THUNDER
// ===============================
// function createThunderAudio() {
//     thunderAudio = new Audio('assets/thunder.mp3');
//     thunderAudio.volume =
//         STORM_CONFIG.thunder.volume;
// }

function playThunder() {
    const delay = randomBetween(
        STORM_CONFIG.thunder.minDelay,
        STORM_CONFIG.thunder.maxDelay
    );

    setTimeout(() => {
        thunderAudio.currentTime = 0;
        thunderAudio.play().catch(() => {});
    }, delay);
}

export function stopStorm() {
    stormStarted = false;

    if(rainCanvas) {
        rainCanvas.remove()
        rainCanvas = null
    }

    const flash =
        document.getElementById('lightningFlash');

    if (flash) {
        flash.remove();
    }

    rainDrops = [];
} 