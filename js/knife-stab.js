import { playAudioKnife } from "./audio.js";

function createKnife() {
    const wrapper = document.getElementById('dateCardsWrapper');

    const knife = document.createElement('img');
    const knifeTip = document.createElement('img');

    knife.className = 'calendar-knife';
    knifeTip.className = 'calendar-knife-tip';

    knife.src = 'assets/knife.png';
    knifeTip.src ='assets/knife-tip.png';

    wrapper.appendChild(knife);
    wrapper.appendChild(knifeTip);

    return {
        knife,
        knifeTip
    };
}

export function animateKnifeStab(targetCard, targetPosition) {
    document
        .querySelectorAll('.calendar-knife, .calendar-knife-tip')
        .forEach(k => k.remove());

    const { knife, knifeTip } = createKnife();

    const targetX = targetPosition.x;
    const targetY = targetPosition.y;

    const knifeOffsetX = 165;
    const knifeOffsetY = -155;

    const knifeTipOffsetX = 180;
    const knifeTipOffsetY = -170;

    gsap.set(knife, {
        x: targetX + 600 + knifeOffsetX,
        y: targetY - 500 + knifeOffsetY,
        rotation: -50,
        scale: 1.1,
        opacity: 1
    });

    gsap.set(knifeTip, {
        x: targetX + 600 + knifeTipOffsetX,
        y: targetY - 500 + knifeTipOffsetY,
        rotation: -50,
        scale: 1.1,
        opacity: 1
    });

    gsap.timeline()
        .to(knife, {
            x: targetX + knifeOffsetX,
            y: targetY + knifeOffsetY,
            duration: 0.45,
            rotation: -50,
            ease: "power4.in",
            onComplete: playAudioKnife
        }, 0)

        .to(knifeTip, {
            x: targetX + knifeTipOffsetX,
            y: targetY + knifeTipOffsetY,
            duration: 0.45,
            rotation: -50,
            ease: "power4.in"
        }, 0)

        .to(knife, {
            x: targetX + knifeOffsetX - 8,
            y: targetY + knifeOffsetY + 1,
            duration: 0.09,
            ease: "power2.out"
        }, 0.45)

        .to(knifeTip, {
            x: targetX + knifeTipOffsetX - 12,
            y: targetY + knifeTipOffsetY + 3,
            duration: 0.09,
            ease: "power2.out"
        }, 0.45);
}