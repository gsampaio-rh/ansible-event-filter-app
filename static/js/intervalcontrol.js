// intervalControl.js

let intervalID;  // Holds the reference to the interval

/**
 * Starts a repetitive action at specified intervals.
 * @param {Function} callback - The function to execute on each interval.
 * @param {number} interval - The time (in milliseconds) how often to execute the action.
 */
function startInterval(callback, interval) {
    if (!intervalID) {  // Ensure no interval is already running
        intervalID = setInterval(callback, interval);
        console.log(`Interval started with ID ${intervalID}.`);
    }
}

/**
 * Stops the currently running interval.
 */
function stopInterval() {
    if (intervalID) {
        clearInterval(intervalID);
        console.log(`Interval with ID ${intervalID} has been stopped.`);
        intervalID = null;  // Reset the interval ID
    }
}

export { startInterval, stopInterval };