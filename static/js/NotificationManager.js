function formatTimestamp(isoString, locale = 'en-US') {
    const date = new Date(isoString);
    return date.toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

export class NotificationManager {
    constructor(container) {
        this.container = container;
        this.notificationCounter = 0;
    }

    formatCondition(condition) {
        // Extract the values after the equality checks
        const formatted = condition.match(/==\s*"([^"]*)"/g)
            .map(item => item.split('==')[1].trim().replace(/"/g, '')) // Remove == and quotes
            .map(item => `| ${item}`) // Add dash for list format
            .join('\n'); // Join with newline

        return formatted;
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' });
    }

    addNotification(matchedRule) {
        const dt = new Date(); // Get current time for log message
        const currentTime = dt.toISOString().replace('T', ' ').substring(0, 19); // Formats to 'YYYY-MM-DD HH:MM:SS'

        // Here you can construct the notification directly from the matched rule object
        const eventId = matchedRule.id; // This generates a random UUID // Example, you might need to adapt based on actual data structure
        const eventName = matchedRule.name;
        const auditRule = matchedRule.condition; // This is just a placeholder, adjust as needed
        const eventFireAt = currentTime; // Using current time as fired at time
        const actionName = matchedRule.actionName;
        const businessType = matchedRule.businessType;

        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'notification';

        const issueNameSpan = document.createElement('span');
        issueNameSpan.className = 'issue-name';
        issueNameSpan.textContent = `${eventName}`;

        const issueIdSpan = document.createElement('span');
        // issueIdSpan.className = 'issue-id';
        issueIdSpan.textContent = `${this.formatCondition(auditRule)}`;

        const actionSpan = document.createElement('span');
        actionSpan.className = 'issue-id';
        actionSpan.textContent = `Sistema impactado: ${businessType}`;

        // const businessSpan = document.createElement('span');
        // businessSpan.className = 'issue-id';
        // businessSpan.textContent = `${businessType}`;

        const firedDateSpan = document.createElement('span');
        firedDateSpan.className = 'issue-fired-at';
        firedDateSpan.textContent = `disparada em ${this.formatTimestamp(eventFireAt)}`;

        notificationDiv.appendChild(issueNameSpan);
        notificationDiv.appendChild(actionSpan);
        // notificationDiv.appendChild(businessSpan);
        notificationDiv.appendChild(issueIdSpan);
        notificationDiv.appendChild(firedDateSpan);

        this.container.prepend(notificationDiv);
    }

}

