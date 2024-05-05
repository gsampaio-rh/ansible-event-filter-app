export class LogManager {
    constructor(container) {
        this.container = container;
        this.messageIndex = 1;
    }

    calculateMaxMessages() {
        const MESSAGE_HEIGHT = 60; // Increased height to accommodate hidden details
        return Math.floor(this.container.clientHeight / MESSAGE_HEIGHT);
    }

    addLogMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `log-message ${this.getMessageType(message)}`;
        messageDiv.innerHTML = this.formatMessage(message);

        // Start the animation for the event message part
        const eventMessageDiv = messageDiv.querySelector('.log-event-message');
        const fullText = eventMessageDiv.textContent;
        eventMessageDiv.textContent = ''; // Ensure it's empty before starting animation
        this.animateText(eventMessageDiv, fullText);

        if (this.container.firstChild) {
            this.container.insertBefore(messageDiv, this.container.firstChild);
        } else {
            this.container.appendChild(messageDiv);
        }
    }

    getMessageType(message) {
        if (message.includes('CRITICAL')) {
            return 'critical';
        } else if (message.includes('WARNING')) {
            return 'warning';
        } else {
            return 'info'; // Default to info if no other type matches
        }
    }

    formatMessage(message) {
        const parts = message.split('|');
        const datetime = parts[0].trim();
        const eventName = parts[1].trim();
        const level = parts[2].trim();
        const details = parts.slice(3, parts.length - 1).join(' | ').trim();
        const eventMessage = parts[parts.length - 2].trim();
        const source = parts[parts.length - 1].split(':')[1].trim(); // Assuming source follows the format "Source: XYZ"

        return `
        <div class="log-message-header">
            <strong>${eventName}</strong>
            <div class="log-timestamp">${datetime}</div>
            <div class="log-event-message">${eventMessage}</div>
        </div>
        <div class="log-details hidden">
            ${details}
        </div>
        <img src="/static/media/${source.toLowerCase().replace(/\s+/g, '')}.png" class="log-source-logo" alt="${source} logo">
    `;
    }

    animateText(element, text, index = 0) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => this.animateText(element, text, index + 1), 50); // Adjust timing to your liking
        }
    }

}
