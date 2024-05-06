import { LogManager } from './LogManager.js';
import { NetworkManager } from './NetworkManager.js';
import { NotificationManager } from './NotificationManager.js';
import { PlaybookManager } from './PlaybookManager.js';
import { BusinessCardManager } from './BusinessCardManager.js';
import auditJsonData from '../media/test-data/audit-rules.json' with { type: 'json' };
import ruleSetJsonData from '../media/test-data/demo-rulebook.json' with { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {

    const businessData = [
        {
            name: "Pix",
            status: "operational",
            icon: "../static/media/logo-pix-icone-512.webp"
        },
        {
            name: "Cartão de Crédito",
            status: "operational",
            icon: "../static/media/cartao-itau.png"
        },
        {
            name: "Conta Corrente",
            status: "operational",
            icon: "../static/media/conta-corrente.png"
        },
        {
            name: "Aplicativo",
            status: "operational",
            icon: "../static/media/itau-logo.png"
        }
    ];

    // Constants for message and node handling
    const MESSAGE_LOGGING_INTERVAL = 2000; // Interval for logging messages
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

        // Read line from file if available
        if (currentLine < fileLines.length) {
            const line = fileLines[currentLine++];
            console.log(`Log message at ${currentTime}: ${line}`)
            logManager.addLogMessage(`${line}`);
            
            // Assuming we have the JSON data loaded into `jsonRules`
            const matchedRule = logManager.evaluateLogMessage(`${line}`);
            
            // If a rule is matched
            if (matchedRule) {
                console.log(`Rule triggered: ${matchedRule}`);
                notificationManager.addNotification(matchedRule);

                // Create and add a new playbook with dynamic status
                const statusOptions = ['pending', 'active', 'failed']; // Example status options
                const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]; // Randomly select status
                const newPlaybook = {
                    name: `${matchedRule.actionName}`,
                    description: `Self-healing para ruleset #${matchedRule.id}`,
                    lastUpdated: currentTime, // Add formatted datetime here
                    status: 'active' // Dynamic status
                };

                playbookManager.addPlaybook(newPlaybook); // Add the new playbook immediately

            }
            
        } else {
            logManager.addLogMessage(`No more lines to read.`);
        }

        networkManager.addNodeAndEdge(MESSAGE_INDEX, colors[MESSAGE_INDEX % colors.length]);

        MESSAGE_INDEX++;

    }, MESSAGE_LOGGING_INTERVAL);
});
