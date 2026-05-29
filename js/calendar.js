import { updateBackgroundByTime } from "./background.js";
import { isHoliday } from "../api/holiday-api.js";
import { animateKnifeStab } from "./knife-stab.js";
import { playAudioCalendar } from "./audio.js";

export function startCalendarSchedular() {
    startCalendar();

    const now = new Date();

    const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0
    );

    setTimeout(() => {
        startCalendar();

        setInterval(() => {
            startCalendar();
        }, 24 * 60 * 60 * 1000);

    }, nextMidnight - now);
}

function isRedDay(date) {
    const isSunday = date.getDay() === 0;
    return isSunday || isHoliday(date);
}

function applyNumberStyle(img, index) {
    const rotations = [-8, 6, -2, 10, -6];
    const yOffsets = [0, -12, 2, -6, 4];
    const scales = [1, 1.08, 1, 1.12, 0.98];

    img.style.transform = `
        rotate(${rotations[index % rotations.length]}deg)
        translateY(${yOffsets[index % yOffsets.length]}px)
        scale(${scales[index % scales.length]})
    `;
}

function applyDayStyle(dayImg) {
    dayImg.style.transform = `
        rotate(${Math.random() * 12 - 6}deg)
        skewX(${Math.random() * 10 - 5}deg)
    `;
}

function startCalendar() {
    updateBackgroundByTime();

    const today = new Date();
    today.setDate(today.getDate() - 1);

    generateCalendar(today);
}

function generateCalendar(today) {
    const wrapper =
        document.getElementById(
            'dateCardsWrapper'
        );

    if (!wrapper) return;

    wrapper.innerHTML = '';

    const positions = [
        {
            x: 0,
            y: 260,
            scale: 0.6,
            rotate: -12,
            numHeight: 150,
            dayHeight: 55
        },
        {
            x: 280,
            y: 330,
            scale: 0.7,
            rotate: -4,
            numHeight: 170,
            dayHeight: 60
        },
        {
            x: 640,
            y: 400,
            scale: 1.0,
            rotate: -2,
            numHeight: 160,
            dayHeight: 80
        },
        {
            x: 890,
            y: 280,
            scale: 0.6,
            rotate: 1.2,
            numHeight: 190,
            dayHeight: 70
        },
        {
            x: 1090,
            y: 200,
            scale: 0.5,
            rotate: 8,
            numHeight: 170,
            dayHeight: 65
        },
        {
            x: 1280,
            y: 220,
            scale: 0.45,
            rotate: 16,
            numHeight: 180,
            dayHeight: 55
        }
    ];

    const cards = [];

    for (let i = 0; i < 6; i++) {
        const dayOffset = i - 2;

        const date = new Date(today);
        date.setDate(
            today.getDate() + dayOffset
        );

        const card =
            createDateCard(
                date,
                positions[i]
            );

        wrapper.appendChild(card.el);

        cards.push({
            ...card,
            position: positions[i],
            dayOffset
        });
    }

    animateCalendar(
        cards,
        positions,
        today
    );
}

function createDateCard(date, config) {
    const card =
        document.createElement('div');

    card.className = 'date-card';
    card.style.position = 'absolute';
    card.style.left = `${config.x}px`;
    card.style.top = `${config.y}px`;

    const number =
        document.createElement('div');

    number.className = 'date-number';

    const digits =
        date.getDate()
            .toString()
            .split('');

    const numberTheme =
        isRedDay(date)
            ? 'red'
            : 'black';

    digits.forEach((digit, index) => {
        const img =
            document.createElement('img');

        img.src =
            `assets/numbers/${numberTheme}/${digit}.png`;

        img.style.height =
            `${config.numHeight}px`;

        applyNumberStyle(img, index);

        number.appendChild(img);
    });

    const day =
        document.createElement('div');

    day.className = 'date-day';

    const dayImg =
        document.createElement('img');

    const dayName =
        date.toLocaleDateString(
            'en-US',
            { weekday: 'long' }
        ).toLowerCase();

    dayImg.src =
        `assets/day/${dayName}.png`;

    dayImg.style.height =
        `${config.dayHeight}px`;

    applyDayStyle(dayImg);

    day.appendChild(dayImg);

    card.appendChild(number);
    card.appendChild(day);

    return {
        el: card,
        number,
        day,
        dayImg
    };
}

// ===============================
// UPDATE CARD
// ===============================
function updateCardContent(
    card,
    newPosition,
    today,
    newDayOffset
) {
    const newDate = new Date(today);

    newDate.setDate(today.getDate() + newDayOffset);
    const digits = newDate.getDate().toString().split('');

    card.number.innerHTML = '';

    // Set Red/Black for holiday/regular
    const numberTheme = isRedDay(newDate) ? 'red' : 'black';

    digits.forEach((digit, index) => {
        const img = document.createElement('img');

        img.src = `assets/numbers/${numberTheme}/${digit}.png`;
        img.style.height = `${newPosition.numHeight}px`;

        applyNumberStyle(img, index);
        card.number.appendChild(img);
    });

    const dayName =
        newDate.toLocaleDateString(
            'en-US',
            { weekday: 'long' }
        ).toLowerCase();

    card.dayImg.src =
        `assets/day/${dayName}.png`;

    gsap.to(card.dayImg, {
        // height: newPosition.dayHeight - 1,
        // rotation:
        //     Math.random() * 12 - 6,
        // skewX:
            // Math.random() * 10 - 5,
        duration: 0.2,
        ease: "power3.in"
    });
}

// ===============================
// ANIMATION
// ===============================
function animateCalendar(
    cards,
    positions,
    today
) {
    const centerCard = cards[2];

    gsap.set(
        cards.map(c => c.el),
        {
            y: -2000,
            opacity: 1,
            rotation: (_, target) => {
                const card =
                    cards.find(
                        c => c.el === target
                    );

                return card.position.rotate;
            },
            scale: (_, target) => {
                const card =
                    cards.find(
                        c => c.el === target
                    );

                return card.position.scale;
            }
        }
    );

    function bounceDrop(
        card,
        dropDuration
    ) {
        return gsap.timeline()
            .to(card.el, {
                y: 0,
                duration: dropDuration,
                ease: "power4.in"
            })
            .to(card.el, {
                y: 8,
                duration: 0.3,
                ease: "power3.out"
            })
            .to(card.el, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
    }

    const tl = gsap.timeline();

    tl.to(centerCard.el, {
        y: 0,
        duration: 0.75,
        ease: "power4.in",
        onComplete: () => {
            playAudioCalendar()
        }
    })

    .add(
        bounceDrop(cards[3], 0.80),
        "-=0.60"
    )

    .add(
        bounceDrop(cards[4], 0.3),
        "-=0.90"
    )

    .add([
        bounceDrop(cards[1], 0.2),
        bounceDrop(cards[5], 0.2)
    ], "-=0.90")

    .add(
        bounceDrop(cards[0], 0.2),
        "-=0.70"
    )

    .to({}, { duration: 0.1 })

    .add(() => {
        const wrapper =
            document.getElementById(
                'dateCardsWrapper'
            );

        const newDate =
            new Date(today);

        newDate.setDate(
            today.getDate() + 4
        );

        const newCardConfig =
            positions[5];

        const newCard =
            createDateCard(
                newDate,
                newCardConfig
            );

        gsap.set(newCard.el, {
            x: 400,
            y: 0,
            scale:
                newCardConfig.scale,
            rotation:
                newCardConfig.rotate,
            opacity: 1
        });

        wrapper.appendChild(
            newCard.el
        );

        const slideTL =
            gsap.timeline();

        slideTL.to(cards[0].el, {
            scaleX: 0,
            scaleY: 0,
            rotation: 500,
            opacity: 0,
            duration: 0.25,
            transformOrigin:
                "top center",
            ease: "back.in(0.1)",
            onComplete: () => {
                cards[0].el.remove();
            }
        }, 0);

        for (let i = 1; i < 6; i++) {
            slideTL.to(cards[i].el, {
                x: positions[i - 1].x - cards[i].position.x,
                y: positions[i - 1].y - cards[i].position.y,
                scale: positions[i - 1].scale,
                rotation:
                    positions[i - 1].rotate,
                duration: 0.4,
                ease: "power4.in",

                onStart:
                    i === 3
                        ? () => {
                            gsap.delayedCall(
                                0.18,
                                () => {
                                    animateKnifeStab(
                                        cards[3],
                                        positions[2]
                                    );
                                }
                            );
                        }
                        : undefined
            }, 0);

            slideTL.add(() => {
                updateCardContent(
                    cards[i],
                    positions[i - 1],
                    today,
                    i - 2
                );
            });
        }

        slideTL.to(newCard.el, {
            x: 0,
            duration: 0.5,
            ease: "power2.inOut"
        }, 0);
    });
}