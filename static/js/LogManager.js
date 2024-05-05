export class LogManager {
    constructor(container) {
        this.container = container;
        this.messageIndex = 1;
    }

    calculateMaxMessages() {
        const MESSAGE_HEIGHT = 20;
        return Math.floor(this.container.clientHeight / MESSAGE_HEIGHT);
    }

    addLogMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'log-message';
        messageDiv.textContent = `#${this.messageIndex++} ${message}`;
        messageDiv.style.display = 'block';

        if (this.container.firstChild) {
            this.container.insertBefore(messageDiv, this.container.firstChild);
        } else {
            this.container.appendChild(messageDiv);
        }

        setTimeout(() => {
            messageDiv.remove();
        }, 60000); // Assuming MESSAGE_REMOVAL_TIMEOUT is 60000 ms

        const maxMessages = this.calculateMaxMessages();
        while (this.container.children.length > maxMessages) {
            this.container.removeChild(this.container.lastChild);
        }
    }
}
