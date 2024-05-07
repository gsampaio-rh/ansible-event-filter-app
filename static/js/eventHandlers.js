// eventHandlers.js
import { startInterval, stopInterval } from './intervalControl.js';
import { getCurrentLine, advanceCurrentLine } from './stateManager.js';  // Import the necessary functions from stateManager

/**
 * Initializes UI event listeners related to application controls like buttons.
 * @param {Function} processLogLine - The function to process log lines.
 * @param {number} MESSAGE_LOGGING_INTERVAL - Interval time for log processing.
 */
function setupControlListeners(processLogLine, MESSAGE_LOGGING_INTERVAL) {
    const toggleButton = document.getElementById('toggleButton');
    if (!toggleButton) {
        console.error("Toggle button not found in the document.");
        return;
    }

    toggleButton.addEventListener('click', function () {
        let currentLine = getCurrentLine();  // Use the centralized currentLine
        if (this.textContent === 'Stop') {
            console.log(`Stopping at #${currentLine}`);
            stopInterval();
            this.textContent = 'Start';
            this.classList.remove('btn-danger');
            this.classList.add('btn-primary');
        } else {
            console.log(`Starting at #${currentLine}`);
            startInterval(() => processLogLine(currentLine), MESSAGE_LOGGING_INTERVAL);
            this.textContent = 'Stop';
            this.classList.remove('btn-primary');
            this.classList.add('btn-danger');
        }
    });
}

/**
 * Sets up event listeners for system box hover effects in the UI.
 */
function setupSystemBoxHover() {
    document.querySelectorAll('.system-box').forEach(box => {
        box.addEventListener('mouseenter', () => {
            console.log("Mouse entered system box.");
            box.querySelector('.system-modal').style.display = 'block';
        });
        box.addEventListener('mouseleave', () => {
            console.log("Mouse left system box.");
            box.querySelector('.system-modal').style.display = 'none';
        });
    });
}

export { setupControlListeners, setupSystemBoxHover };
