// utils.js
export function formatDateTime(date) {
    return date.toISOString().replace('T', ' ').substring(0, 19);
}

export function logError(message, error) {
    console.error(message, error);
}
