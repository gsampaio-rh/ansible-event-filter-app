// apis.js
import { setFileLines } from './stateManager.js';
import { startInterval } from './intervalControl.js';
import { processLogLine } from './processLogLine.js'; // Make sure to export processLogLine from wherever it currently resides
import { MESSAGE_LOGGING_INTERVAL } from './config.js';

/**
 * Fetches log data from the server and processes it.
 */
async function fetchLogData() {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch('/fetch-log');
            if (!response.ok) throw new Error('Failed to fetch logs');

            const data = await response.text();
            setFileLines(data.split('\n'));
            startInterval(processLogLine, MESSAGE_LOGGING_INTERVAL);
            break; // Break if fetch is successful
        } catch (error) {
            console.error(`Attempt ${attempt}: Failed to load log file`, error);
            if (attempt === maxRetries) {
                console.error("Max retries reached. Giving up.");
                // Optionally, notify the user or enable a retry button.
            }
        }
    }
}

export { fetchLogData };
