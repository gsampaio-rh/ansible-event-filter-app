// LogManager.js
export class LogManager {
    constructor(container, networkManager) {
        this.container = container;
        this.messageIndex = 1;
        this.networkManager = networkManager;
    }

    calculateMaxMessages() {
        const MESSAGE_HEIGHT = 60;  // Increased height to accommodate hidden details
        return Math.floor(this.container.clientHeight / MESSAGE_HEIGHT);
    }

    extractFieldsFromMessage(message) {
        const parts = message.split('|');
        return {
            datetime: parts[0].trim(),
            serviceName: parts[1].trim(),
            severity: parts[2].trim(),
            details: parts.slice(3, parts.length - 2).join(' | ').trim(),
            eventMessage: parts[parts.length - 3].trim(),
            source: parts[parts.length - 2].split(':')[1].trim(),
            businessType: parts[parts.length - 1].split(':')[1].trim()
        };
    }

    createLogMessageElement(id, fields) {
        const element = document.createElement('div');
        element.className = `log-message ${fields.severity.toLowerCase()}`;
        element.id = `log-message-${id}`;
        element.innerHTML = this.formatMessage(id, fields);
        return element;
    }

    appendAndAnimateLogMessage(element) {
        // Insert before the first child or append to container if empty
        this.container.firstChild ? this.container.insertBefore(element, this.container.firstChild) : this.container.appendChild(element);

        // Find the element that needs animation and start it
        const eventMessageDiv = element.querySelector('.log-event-message');
        this.animateText(eventMessageDiv, eventMessageDiv.textContent);
    }

    setupMessageEvents(id, element) {
        element.addEventListener('mouseover', () => this.networkManager.updateNodeColor(id, 'highlightColor'));
        element.addEventListener('mouseout', () => this.networkManager.updateNodeColor(id, 'defaultColor'));
    }

    addLogMessage(id, message) {
        const fields = this.extractFieldsFromMessage(message);
        const messageDiv = this.createLogMessageElement(id, fields);
        messageDiv.classList.toggle('error-flash', fields.severity === 'ERROR' || fields.severity === 'CRITICAL');

        this.appendAndAnimateLogMessage(messageDiv);
        this.setupMessageEvents(id, messageDiv);

        return fields;
    }

    getMessageType(message) {
        if (message.includes('CRITICAL')) return 'critical';
        if (message.includes('WARNING')) return 'warning';
        return 'info';
    }

    formatMessage(id, fields) {
        // Use object destructuring to extract field values

        const { datetime, serviceName, eventMessage, businessType, details, source } = fields;

        // Construct the HTML string using template literals and the extracted values
        return `
        <div class="log-message-header">
            <strong>${serviceName}</strong>
            <div class="log-timestamp">#${id} - ${datetime}</div>
            <div class="log-event-message">${eventMessage} - ${businessType}</div>
        </div>
        <div class="log-details hidden">${details}</div>
        <img src="/static/media/${source.toLowerCase().replace(/\s+/g, '')}.png" class="log-source-logo" alt="${source} logo">
    `;
    }

    animateText(element, text) {
        element.textContent = ''; // Clear the element's content before starting the animation
        let index = 0; // Start from the first character
        const animate = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(animate, 50); // Adjust timing to your liking
            }
        };
        animate();
    }
}
