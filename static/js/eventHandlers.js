// eventHandlers.js
import { startInterval, stopInterval } from './intervalcontrol.js';

export function attachToggleButtonListener() {
    const button = document.getElementById('toggleButton');
    if (!button) {
        console.error("Toggle button not found!");
        return;
    }

    button.addEventListener('click', toggleButtonHandler);
}

export function detachToggleButtonListener() {
    const button = document.getElementById('toggleButton');
    if (!button) {
        console.error("Toggle button not found!");
        return;
    }

    button.removeEventListener('click', toggleButtonHandler);
}

function toggleButtonHandler() {
    const button = this; // 'this' refers to the button as this function is called on click
    if (button.textContent === 'Stop') {
        console.log("Stopping...");
        stopInterval();
        button.textContent = 'Start';
        button.classList.remove('btn-danger');
        button.classList.add('btn-primary');
    } else {
        console.log("Starting...");
        startInterval();
        button.textContent = 'Stop';
        button.classList.remove('btn-primary');
        button.classList.add('btn-danger');
    }
}

export function setupToggleButton() {
    document.getElementById('toggleButton').addEventListener('click', function () {
        var button = this;
        if (button.textContent === 'Stop') {
            console.log(`Stopping at  #${currentLine}`);
            stopInterval();
            button.textContent = 'Start';
            button.classList.remove('btn-danger');
            button.classList.add('btn-primary');
        } else {
            console.log(`Starting at  #${currentLine}`);
            startInterval();
            button.textContent = 'Stop';
            button.classList.remove('btn-primary');
            button.classList.add('btn-danger');
        }
    });
}

export function setupSystemBoxHover() {
    document.querySelectorAll('.system-box').forEach(box => {
        box.addEventListener('mouseenter', function () {
            this.querySelector('.system-modal').style.display = 'block';
        });
        box.addEventListener('mouseleave', function () {
            this.querySelector('.system-modal').style.display = 'none';
        });
    });
}
