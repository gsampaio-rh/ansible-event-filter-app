// LogManager.js
export class LogManager {
    constructor(container, networkManager) {
        this.container = container;
        this.messageIndex = 1;
        this.networkManager = networkManager;
    }

    calculateMaxMessages() {
        const MESSAGE_HEIGHT = 60; // Increased height to accommodate hidden details
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

    createLogMessageElement(id, message) {
        const element = document.createElement('div');
        element.className = `log-message ${this.getMessageType(message)}`;
        element.id = `log-message-${id}`;
        element.innerHTML = this.formatMessage(id, message);
        return element;
    }

    appendLogMessage(element) {
        if (this.container.firstChild) {
            this.container.insertBefore(element, this.container.firstChild);
        } else {
            this.container.appendChild(element);
        }
    }

    setupMessageEvents(id, element, networkManager) {
        element.addEventListener('mouseover', () => networkManager.updateNodeColor(id, 'highlightColor'));
        element.addEventListener('mouseout', () => networkManager.updateNodeColor(id, 'defaultColor'));
    }

    addLogMessage(id, message) {
        const messageDiv = this.createLogMessageElement(id, message);

        // Extract the log message fields
        const fields = this.extractFieldsFromMessage(message);

        if (fields.severity === 'ERROR' || fields.severity === 'CRITICAL') {
            messageDiv.classList.add('error-flash'); // Add the class if the log is critical or an error
        }

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


        // Add event listeners for hovering
        this.setupMessageEvents(id, messageDiv, this.networkManager);

        // Return the extracted fields from the log message as an object
        return fields;
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

    formatMessage(id, message) {
        const parts = message.split('|');
        const datetime = parts[0].trim();
        const eventName = parts[1].trim();
        const level = parts[2].trim();
        const details = parts.slice(3, parts.length - 2).join(' | ').trim();
        const eventMessage = parts[parts.length - 3].trim();
        const source = parts[parts.length - 2].split(':')[1].trim();
        const businessType = parts[parts.length - 1].split(':')[1].trim();

        return `
            <div class="log-message-header">
                <strong>${eventName}</strong>
                <div class="log-timestamp">#${id} - ${datetime}</div>
                <div class="log-event-message">${eventMessage} - ${businessType}</div>
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
