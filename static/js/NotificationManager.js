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

    addNotification(id, rule, rule_id, fired_at) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'notification';

        const issueIdSpan = document.createElement('span');
        issueIdSpan.className = 'issue-id';
        issueIdSpan.textContent = `Auditoria ${id} detectada!`;

        const issueNameSpan = document.createElement('span');
        issueNameSpan.className = 'issue-name';
        issueNameSpan.textContent = `${rule} (#${rule_id})`;

        const firedDateSpan = document.createElement('span');
        firedDateSpan.className = 'issue-fired-at';
        firedDateSpan.textContent = `disparada em ${formatTimestamp(fired_at)}`;

        notificationDiv.appendChild(issueIdSpan);
        notificationDiv.appendChild(issueNameSpan);
        notificationDiv.appendChild(firedDateSpan);

        this.container.prepend(notificationDiv);
    }
}

