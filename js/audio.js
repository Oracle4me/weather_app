const knifeAudio = new Audio('assets/audio/knife-stab.wav');
const calendarAudio = new Audio('assets/audio/calendar_down.mp3');

export function playAudioKnife() {
    knifeAudio.volume = 0.55;
    knifeAudio.preload = 'auto';
    knifeAudio.currentTime = 0;
    knifeAudio.play().catch(() => {});
}

export function playAudioCalendar() {
    calendarAudio.volume = 0.99;
    calendarAudio.preload = 'auto';
    calendarAudio.currentTime = 0;
    calendarAudio.play().catch(() => {});
}

