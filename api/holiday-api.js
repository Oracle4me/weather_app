const CALENDARIFIC_API_KEY = '07jRdoA79hoTVAYaeoT2rqt3eXKg0IZY';

let holidayCache = new Set();

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getStorageKey(year) {
    return `holiday_cache_ID_${year}`;
}

function loadFromStorage(year) {
    const storageKey = getStorageKey(year);

    const cached =
        localStorage.getItem(storageKey);

    if (!cached) return false;

    try {
        const parsed = JSON.parse(cached);

        parsed.forEach(date => {
            holidayCache.add(date);
        });

        console.log(
            `Holiday cache loaded (${year})`
        );

        return true;

    } catch {
        localStorage.removeItem(storageKey);
        return false;
    }
}

async function requestHolidayYear(year) {
    const response = await fetch(
        `https://calendarific.com/api/v2/holidays?api_key=${CALENDARIFIC_API_KEY}&country=ID&year=${year}`
    );

    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status}`
        );
    }

    const data = await response.json();

    if (
        !data.response ||
        !data.response.holidays
    ) {
        throw new Error(
            'Invalid API response'
        );
    }

    const dates =
        data.response.holidays
            .map(holiday => {
                const iso =
                    holiday?.date?.iso;

                if (!iso) return null;

                return iso.split('T')[0];
            })
            .filter(Boolean);

    localStorage.setItem(
        getStorageKey(year),
        JSON.stringify(dates)
    );

    dates.forEach(date => {
        holidayCache.add(date);
    });

    console.log(
        `Holiday API fetched (${year})`,
        dates
    );
}

async function ensureHolidayYear(year) {
    const loaded =
        loadFromStorage(year);

    if (loaded) return;

    await requestHolidayYear(year);
}

export async function initHolidayAPI() {
    const currentYear =
        new Date().getFullYear();

    await Promise.all([
        ensureHolidayYear(currentYear),
        ensureHolidayYear(currentYear + 1)
    ]);
}

export function isHoliday(date) {
    const key =
        formatDateKey(date);

    console.log(
        'CHECK:',
        key,
        holidayCache.has(key)
    );

    return holidayCache.has(key);
}