// intervalControl.js
let intervalID;

// Make sure this function is defined to use the callback properly
export function startInterval(callback, interval) {
    console.log("Starting interval...");
    intervalID = setInterval(callback, interval);
    console.log(`Interval started with ID: ${intervalID}`);
}

export function stopInterval() {
    console.log("Stopping interval...");
    clearInterval(intervalID);
    console.log(`Interval stopped with interval ID: ${intervalID}`);
}
