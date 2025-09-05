/**
 * Retourne la date d’aujourd’hui au format ISO (YYYY-MM-DD).
 */
function getTodayDate() {
    const d = new Date();
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');

    return `${y}-${m}-${day}`;
}

/**
 * Retourne une date formatée en français.
 */
function renderDate(date) {
    console.log("ROW DATE :", date);

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const d = new Date(date);

    return d.toLocaleDateString('fr-FR', options);
}

module.exports = { getTodayDate, renderDate };