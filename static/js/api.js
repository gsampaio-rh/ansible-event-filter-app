// api.js
export async function fetchLogData() {
    try {
        const response = await fetch('/fetch-log');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        console.log("Data received from fetch:", data.slice(0, 100)); // Log first 100 chars
        return data.split('\n');
    } catch (error) {
        console.error("Failed to load log file", error);
        return [];
    }
}
