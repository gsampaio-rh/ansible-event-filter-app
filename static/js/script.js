import { LogManager } from './LogManager.js';
import { NetworkManager } from './NetworkManager.js';
import { NotificationManager } from './NotificationManager.js';
import { PlaybookManager } from './PlaybookManager.js';
import auditJsonData from '../media/test-data/audit-rules.json' with { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
    const logContainer = document.getElementById('log-container');
    const networkContainer = document.getElementById('network');
    const notificationContainer = document.getElementById('notification-container');
    const playbooksContainer = document.getElementById('playbooks-container');

    if (!logContainer || !networkContainer || !notificationContainer || !playbooksContainer) {
        console.error("Required DOM elements are missing.");
        return;
    }

    if (!auditJsonData) {
        console.error("Failed to load JSON data. Please check the path and server configuration.");
        return; // Exit if data is not loaded
    }

    // Constants for message and node handling
    const MESSAGE_LOGGING_INTERVAL = 3000; // Interval for logging messages
    const MESSAGE_REMOVAL_TIMEOUT = MESSAGE_LOGGING_INTERVAL * 20; // Time after which a message is removed
    const colors = ['#FFC107', '#03A9F4', '#4CAF50', '#E91E63', '#FFEB3B', '#009688', '#673AB7', '#3F51B5', '#FF5722', '#795548'];

    let notificationCounter = 0; // Counter to track the number of messages for triggering notifications
    let MESSAGE_INDEX = 1;

    const logManager = new LogManager(logContainer);
    const networkManager = new NetworkManager(networkContainer);
    const notificationManager = new NotificationManager(notificationContainer);
    const playbookManager = new PlaybookManager(playbooksContainer);

    

    setInterval(() => {
        const currentTime = new Date().toLocaleTimeString(); // Get current time for log message
        
        logManager.addLogMessage(`Log message at ${currentTime}`);
        
        // // Add notification every 3 log messages
        // if (++notificationCounter % 2 === 0) {
        //     notificationManager.addNotification(`Issue #${MESSAGE_INDEX}`);
        // }

        if (++notificationCounter % 2 === 0) {
            // Select a random entry from the JSON data
            const randomEntry = auditJsonData.results[Math.floor(Math.random() * auditJsonData.results.length)];
            const eventId = randomEntry.id;
            const eventName = randomEntry.name;
            const auditRule = randomEntry.activation_instance.id;
            const eventFireAt = randomEntry.fired_at;
            console.log(randomEntry)
            // Use the 'name' and 'status' of the random entry to generate the notification
            notificationManager.addNotification(eventId, eventName, auditRule, eventFireAt);
        }

        // Create and add a new playbook with dynamic status
        const statusOptions = ['pending', 'active', 'failed']; // Example status options
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]; // Randomly select status
        const newPlaybook = {
            name: `Playbook ${MESSAGE_INDEX}`,
            description: `Description of Playbook ${MESSAGE_INDEX}`,
            status: randomStatus // Dynamic status
        };

        playbookManager.addPlaybook(newPlaybook); // Add the new playbook immediately

        networkManager.addNodeAndEdge(MESSAGE_INDEX, colors[MESSAGE_INDEX % colors.length]);

        MESSAGE_INDEX++;

    }, MESSAGE_LOGGING_INTERVAL);
});
