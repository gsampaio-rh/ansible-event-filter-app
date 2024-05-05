import { LogManager } from './LogManager.js';
import { NetworkManager } from './NetworkManager.js';
import { NotificationManager } from './NotificationManager.js';
import { PlaybookManager } from './PlaybookManager.js';
import { BusinessCardManager } from './BusinessCardManager.js';
import auditJsonData from '../media/test-data/audit-rules.json' with { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {

    const businessData = [
        {
            name: "Pix",
            status: "operational",
            icon: "../static/media/logo-pix-icone-512.webp"
        },
        {
            name: "Cartão",
            status: "operational",
            icon: "../static/media/cartao-itau.png"
        },
        {
            name: "Itaú #3",
            status: "operational",
            icon: "../static/media/itau-logo.png"
        },
        {
            name: "Itaú #4",
            status: "operational",
            icon: "../static/media/itau-logo.png"
        }
    ];

    // Constants for message and node handling
    const MESSAGE_LOGGING_INTERVAL = 3000; // Interval for logging messages
    const MESSAGE_REMOVAL_TIMEOUT = MESSAGE_LOGGING_INTERVAL * 20; // Time after which a message is removed
    const colors = ['#FFC107', '#03A9F4', '#4CAF50', '#E91E63', '#FFEB3B', '#009688', '#673AB7', '#3F51B5', '#FF5722', '#795548'];

    const logsFile = "../media/test-data/sample_log.txt";
    const logContainer = document.getElementById('log-container');
    const networkContainer = document.getElementById('network');
    const notificationContainer = document.getElementById('notification-container');
    const playbooksContainer = document.getElementById('playbooks-container');

    const logManager = new LogManager(logContainer);
    const networkManager = new NetworkManager(networkContainer);
    const notificationManager = new NotificationManager(notificationContainer);
    const playbookManager = new PlaybookManager(playbooksContainer);

    if (!logContainer || !networkContainer || !notificationContainer || !playbooksContainer) {
        console.error("Required DOM elements are missing.");
        return;
    }

    if (!auditJsonData) {
        console.error("Failed to load JSON data. Please check the path and server configuration.");
        return; // Exit if data is not loaded
    }
    
    fetch('/fetch-log')
        .then(response => response.text())
        .then(data => {
            fileLines = data.split('\n'); // Split the file content into lines
        })
        .catch(error => console.error("Failed to load log file", error));
    
    const manager = new BusinessCardManager('business-container', businessData);
    manager.populateBusinessContainer();
    
    let notificationCounter = 0; // Counter to track the number of messages for triggering notifications
    let MESSAGE_INDEX = 1;
    
    let fileLines = [];
    let currentLine = 0;

    setInterval(() => {
        const dt = new Date(); // Get current time for log message
        const currentTime = dt.toISOString().replace('T', ' ').substring(0, 19); // Formats to 'YYYY-MM-DD HH:MM:SS'
        
        // logManager.addLogMessage(`Log message at ${currentTime}`);

        // Read line from file if available
        if (currentLine < fileLines.length) {
            const line = fileLines[currentLine++];
            console.log(`Log message at ${currentTime}: ${line}`)
            logManager.addLogMessage(`${line}`);
        } else {
            logManager.addLogMessage(`No more lines to read.`);
        }

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
            lastUpdated: currentTime, // Add formatted datetime here
            status: randomStatus // Dynamic status
        };

        playbookManager.addPlaybook(newPlaybook); // Add the new playbook immediately

        networkManager.addNodeAndEdge(MESSAGE_INDEX, colors[MESSAGE_INDEX % colors.length]);

        MESSAGE_INDEX++;

    }, MESSAGE_LOGGING_INTERVAL);
});
