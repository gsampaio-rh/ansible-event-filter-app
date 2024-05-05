export class NotificationManager {
    constructor(container) {
        this.container = container;
        this.notificationCounter = 0;
    }

    addNotification(message) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'notification';
        notificationDiv.innerHTML = `Event detected! Issue <span class="issue-name">${message}</span> identified!`;

        if (this.container.firstChild) {
            this.container.insertBefore(notificationDiv, this.container.firstChild);
        } else {
            this.container.appendChild(notificationDiv);
        }
    }
}
