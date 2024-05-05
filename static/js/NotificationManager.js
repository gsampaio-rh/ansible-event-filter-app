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

    addNotification(id, rule, rule_id, fired_at) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'notification';

        const issueIdSpan = document.createElement('span');
        issueIdSpan.className = 'issue-id';
        issueIdSpan.textContent = `${this.formatCondition(rule_id)}`;

        const issueNameSpan = document.createElement('span');
        issueNameSpan.className = 'issue-name';
        issueNameSpan.textContent = `${rule}`;

        const firedDateSpan = document.createElement('span');
        firedDateSpan.className = 'issue-fired-at';
        firedDateSpan.textContent = `disparada em ${this.formatTimestamp(fired_at)}`;

        notificationDiv.appendChild(issueNameSpan);
        notificationDiv.appendChild(issueIdSpan);
        notificationDiv.appendChild(firedDateSpan);

        this.container.prepend(notificationDiv);
    }
}

