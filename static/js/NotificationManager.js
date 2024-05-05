function formatTimestamp(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
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

        const firedDate = formatTimestamp(fired_at);

        // More structured HTML assembly
        notificationDiv.innerHTML = `
            <span class="issue-id">Event ${id} detected!</span>
            <span class="issue-name">${rule} (#${rule_id})</span>
            <span class="issue-fired-at">fired at ${firedDate}</span>
        `;

        // More robust insertion handling
        this.container.prepend(notificationDiv); // Always inserts at the top
    }
}
