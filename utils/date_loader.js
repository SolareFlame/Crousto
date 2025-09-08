/**
 * Retourne la date d’aujourd’hui au format ISO (YYYY-MM-DD).
 */
export function getTodayDate() {
    const d = new Date();
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');

    //return '2025-09-05';

    return `${y}-${m}-${day}`;
}

/**
 * Retourne une date formatée en français.
 */
export function renderDate(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const d = new Date(date);

    return d.toLocaleDateString('fr-FR', options);
}
