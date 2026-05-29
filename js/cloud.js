const CLOUD_THEMES = {
    day: {
        brightness: 1.1,
        opacity: 0.85,
        blur: 0,
        hue: 0
    },

    sunset: {
        brightness: 0.95,
        opacity: 0.8,
        blur: 0,
        hue: -15
    },

    night: {
        brightness: 0.55,
        opacity: 0.7,
        blur: 0.5,
        hue: 210
    },

    storm: {
        brightness: 0.35,
        opacity: 0.95,
        blur: 1,
        hue: 220
    },

    heavyStorm: {
        brightness: 0.22,
        opacity: 1,
        blur: 1.5,
        hue: 230
    },

    fog: {
        brightness: 0.95,
        opacity: 0.5,
        blur: 3,
        hue: 0
    }
};
function applyCloudTheme(cloud, themeName = 'day') {
    const theme = CLOUD_THEMES[themeName];

    if (!theme) return;

    cloud.style.filter = `
        brightness(${theme.brightness})
        hue-rotate(${theme.hue}deg)
        blur(${theme.blur}px)
    `;

    cloud.style.opacity = theme.opacity;
}

const cloudAssets = [
    'assets/cloud/cloud1.svg',
    'assets/cloud/cloud2.svg',
    'assets/cloud/cloud3.svg',
    'assets/cloud/cloud4.svg',
    'assets/cloud/cloud5.svg',
    'assets/cloud/cloud6.svg'
];

const curvePoints = {
    A: { x: -300, y: 200 },
    B: { x: window.innerWidth / 2, y: -100 },
    C: { x: window.innerWidth + 300, y: 200 }
};

const cloudHeightOffsets = [
    30,
    -20,
    -40,
    30,
    60,
    20
];

function getCurvePoint(t) {
    const { A, B, C } = curvePoints;

    const x =
        Math.pow(1 - t, 2) * A.x +
        2 * (1 - t) * t * B.x +
        Math.pow(t, 2) * C.x;

    const y =
        Math.pow(1 - t, 2) * A.y +
        2 * (1 - t) * t * B.y +
        Math.pow(t, 2) * C.y;

    return { x, y };
}

function getCurveRotation(t) {
    const { A, B, C } = curvePoints;

    const dx =
        2 * (1 - t) * (B.x - A.x) +
        2 * t * (C.x - B.x);

    const dy =
        2 * (1 - t) * (B.y - A.y) +
        2 * t * (C.y - B.y);

    return Math.atan2(dy, dx) * (180 / Math.PI);
}

function getCurveScale(t) {
    const dist = Math.abs(t - 0.5);

    return 1.15 - dist * 0.8;
}

function createCurveCloud(startProgress, direction, theme = 'day') {
    const layer = document.getElementById('cloudsLayer');
    if (!layer) return;

    const randomIndex = Math.floor(Math.random() * cloudAssets.length);

    const img = document.createElement('img');
    img.className = 'cloud';
    img.src = cloudAssets[randomIndex];
    applyCloudTheme(img, theme);

    const baseHeight =
        cloudHeightOffsets[
            Math.floor(Math.random() * cloudHeightOffsets.length)
        ];

    const randomExtraOffset = -(Math.random() * 30);

    const heightOffset = baseHeight + randomExtraOffset;

    layer.appendChild(img);

    animateCurveCloud(
        img,
        startProgress,
        heightOffset,
        direction
    );
}

function animateCurveCloud(
    cloud,
    startProgress,
    heightOffset = 0,
    direction,
    theme
) {
    const randomDuration = 18 + Math.random() * 12;

    const state = {
        progress: startProgress
    };

    const targetProgress =
        direction === 'ltr' ? 1 : 0;

    gsap.to(state, {
        progress: targetProgress,
        duration: randomDuration,
        ease: "none",

        onUpdate: () => {
            const point = getCurvePoint(state.progress);
            const rotation = getCurveRotation(state.progress);
            const scale = getCurveScale(state.progress);

            gsap.set(cloud, {
                x: point.x,
                y: point.y + heightOffset,
                rotation,
                scale,
                transformOrigin: "center center"
            });

            // spawn sebelum selesai
            if (!cloud.dataset.spawned) {
                const shouldSpawn =
                    direction === 'ltr'
                        ? state.progress >= 0.35
                        : state.progress <= 0.65;

                if (shouldSpawn) {
                    cloud.dataset.spawned = "true";

                    const newDirection =
                        Math.random() > 0.5 ? 'ltr' : 'rtl';

                    const newStart =
                        newDirection === 'ltr' ? 0 : 1;

                    createCurveCloud(newStart, newDirection, theme);
                }
            }
        },

        onComplete: () => {
            cloud.remove();
        }
    });
}

export function initClouds(theme = 'day') {
    createCurveCloud(0.12, 'ltr', theme);
    createCurveCloud(0.36, 'ltr', theme);
    createCurveCloud(0.67, 'ltr', theme);

    createCurveCloud(0.88, 'rtl', theme);
    createCurveCloud(0.58, 'rtl', theme);
    createCurveCloud(0.29, 'rtl', theme);
}