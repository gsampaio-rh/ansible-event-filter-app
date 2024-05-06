import { LogManager } from './LogManager.js';
import { NetworkManager } from './NetworkManager.js';
import { NotificationManager } from './NotificationManager.js';
import { PlaybookManager } from './PlaybookManager.js';
import { BusinessCardManager } from './BusinessCardManager.js';
import { ArchitectureManager } from './ArchitectureManager.js';
import auditJsonData from '../media/test-data/audit-rules.json' with { type: 'json' };

let intervalID; // Variable to hold the interval ID for starting or stopping it
let fileLines = []; // To store lines fetched from logs
let currentLine = 0; // To keep track of the current line being processed
let MESSAGE_INDEX = 1; // To track the number of messages processed

const MESSAGE_LOGGING_INTERVAL = 3000; // Interval for logging messages
const colors = ['#FFC107', '#03A9F4', '#4CAF50', '#E91E63', '#FFEB3B', '#009688', '#673AB7', '#3F51B5', '#FF5722', '#795548']; // Colors for nodes

document.addEventListener('DOMContentLoaded', () => {

    const businessData = [
        {
            name: "Pix",
            system: "pix",
            status: "operational",
            icon: "../static/media/logo-pix-icone-512.webp"
        },
        {
            name: "Cartão de Crédito",
            system: "cartao_credito",
            status: "operational",
            icon: "../static/media/cartao-itau.png"
        },
        {
            name: "Conta Corrente",
            system: "conta_corrente",
            status: "operational",
            icon: "../static/media/conta-corrente.png"
        },
        {
            name: "Aplicativo",
            system: "mobile_banking",
            status: "operational",
            icon: "../static/media/itau-logo-no-bg.png"
        }
    ];

    const architectureData = [
        {
            name: "API Itaú",
            system: "cartao_credito",
            status: "operational",
            icon: "../static/media/api.png"
        },
        {
            name: "Banco de Dados",
            system: "conta_corrente",
            status: "operational",
            icon: "../static/media/db.png"
        },
        {
            name: "Kafka",
            system: "mobile_banking",
            status: "operational",
            icon: "../static/media/kafkaicon.png"
        },
        {
            name: "Integrador Banco Central",
            system: "pix",
            status: "operational",
            icon: "../static/media/fuse.png"
        }
    ];

    const logContainer = document.getElementById('log-container');
    const networkContainer = document.getElementById('network');
    const notificationContainer = document.getElementById('notification-container');
    const playbooksContainer = document.getElementById('playbooks-container');
    const businessContainer = document.getElementById('business-container');

    if (!logContainer || !networkContainer || !notificationContainer || !playbooksContainer || !businessContainer) {
        console.error("Required DOM elements are missing.");
        return;
    }

    const logManager = new LogManager(logContainer);
    const networkManager = new NetworkManager(networkContainer);
    const notificationManager = new NotificationManager(notificationContainer);
    const playbookManager = new PlaybookManager(playbooksContainer);
    const manager = new BusinessCardManager('business-container', businessData);
    const archManager = new ArchitectureManager('architecture-container', architectureData);

    function processLogLine() {
        const dt = new Date();
        const currentTime = dt.toISOString().replace('T', ' ').substring(0, 19);
        if (currentLine < fileLines.length) {
            const line = fileLines[currentLine++];
            console.log(`#${MESSAGE_INDEX} Log message at ${currentTime}: ${line}`);

            const logMessage = logManager.addLogMessage(MESSAGE_INDEX, line);
            console.log(logMessage);

            // If a rule is matched and it's either 'ERROR' or 'CRITICAL'
            if (logMessage && (logMessage.severity === 'ERROR' || logMessage.severity === 'CRITICAL')) {
                console.log(`Critical or Error rule triggered: ${logMessage.eventMessage}`);
                if (logMessage.businessType) {
                    manager.toggleBusinessStatus(logMessage.businessType, 'disabled'); // Disable the business
                    console.log(`Business type '${logMessage.businessType}' has been disabled due to severity.`);
                    archManager.toggleArchStatus(logMessage.businessType, 'disabled'); // Disable the component
                    console.log(`Architecture Component API has been disabled due to severity.`);
                }
            }

            // Evaluate log message against rules
            const matchedRule = logManager.evaluateLogMessage(line);

            // If a rule is matched
            if (matchedRule) {
                console.log(`Rule triggered: ${matchedRule}`);
                notificationManager.addNotification(matchedRule);

                // Create and add a new playbook with dynamic status
                const newPlaybook = {
                    name: `${matchedRule.actionName}`,
                    description: `Self-healing para ruleset #${matchedRule.id}`,
                    lastUpdated: currentTime, // Add formatted datetime here
                    status: 'active' // Dynamic status
                };

                playbookManager.addPlaybook(newPlaybook); // Add the new playbook immediately

                // Check if the matched rule affects a specific business type and update its status
                if (matchedRule.businessType) {
                    manager.toggleBusinessStatus(matchedRule.businessType, 'operational'); // Re-enable the business
                    archManager.toggleArchStatus(logMessage.businessType, 'operational'); // Re-enable the component
                }
            }

            MESSAGE_INDEX++;
            networkManager.addNodeAndEdge(MESSAGE_INDEX, colors[MESSAGE_INDEX % colors.length]);

        } else {
            console.log("No more lines to read.");
            stopInterval(); // Stop the interval if no more lines to process
        }
    }

    function fetchLogData() {
        fetch('/fetch-log')
            .then(response => response.text())
            .then(data => {
                fileLines = data.split('\n'); // Split the file content into lines
                startInterval(); // Start processing logs after fetching
            })
            .catch(error => console.error("Failed to load log file", error));
    }

    function startInterval() {
        intervalID = setInterval(processLogLine, MESSAGE_LOGGING_INTERVAL);
    }

    function stopInterval() {
        clearInterval(intervalID);
    }

    manager.populateBusinessContainer();
    archManager.populateArchitectureContainer();
    fetchLogData(); // Start the log fetching and processing
});

// document.addEventListener('DOMContentLoaded', () => {

//     const businessData = [
//         {
//             name: "Pix",
//             system: "pix",
//             status: "operational",
//             icon: "../static/media/logo-pix-icone-512.webp"
//         },
//         {
//             name: "Cartão de Crédito",
//             system: "cartao_credito",
//             status: "operational",
//             icon: "../static/media/cartao-itau.png"
//         },
//         {
//             name: "Conta Corrente",
//             system: "conta_corrente",
//             status: "operational",
//             icon: "../static/media/conta-corrente.png"
//         },
//         {
//             name: "Aplicativo",
//             system: "mobile_banking",
//             status: "operational",
//             icon: "../static/media/itau-logo.png"
//         }
//     ];

//     // Constants for message and node handling
//     const MESSAGE_LOGGING_INTERVAL = 3000; // Interval for logging messages
//     const MESSAGE_REMOVAL_TIMEOUT = MESSAGE_LOGGING_INTERVAL * 20; // Time after which a message is removed
//     const colors = ['#FFC107', '#03A9F4', '#4CAF50', '#E91E63', '#FFEB3B', '#009688', '#673AB7', '#3F51B5', '#FF5722', '#795548'];

//     const logsFile = "../media/test-data/sample_log.txt";
//     const logContainer = document.getElementById('log-container');
//     const networkContainer = document.getElementById('network');
//     const notificationContainer = document.getElementById('notification-container');
//     const playbooksContainer = document.getElementById('playbooks-container');

//     const logManager = new LogManager(logContainer);
//     const networkManager = new NetworkManager(networkContainer);
//     const notificationManager = new NotificationManager(notificationContainer);
//     const playbookManager = new PlaybookManager(playbooksContainer);

//     if (!logContainer || !networkContainer || !notificationContainer || !playbooksContainer) {
//         console.error("Required DOM elements are missing.");
//         return;
//     }

//     if (!auditJsonData) {
//         console.error("Failed to load JSON data. Please check the path and server configuration.");
//         return; // Exit if data is not loaded
//     }
    
//     fetch('/fetch-log')
//         .then(response => response.text())
//         .then(data => {
//             fileLines = data.split('\n'); // Split the file content into lines
//         })
//         .catch(error => console.error("Failed to load log file", error));

//     const manager = new BusinessCardManager('business-container', businessData);
//     manager.populateBusinessContainer();
    
//     let notificationCounter = 0; // Counter to track the number of messages for triggering notifications
//     let MESSAGE_INDEX = 1;
    
//     let fileLines = [];
//     let currentLine = 0;

//     setInterval(() => {
//         const dt = new Date(); // Get current time for log message
//         const currentTime = dt.toISOString().replace('T', ' ').substring(0, 19); // Formats to 'YYYY-MM-DD HH:MM:SS'

//         // Read line from file if available
//         if (currentLine < fileLines.length) {
//             const line = fileLines[currentLine++];
//             console.log(`#${MESSAGE_INDEX} Log message at ${currentTime}: ${line}`)
//             const logMessage = logManager.addLogMessage(MESSAGE_INDEX, line);

//             // If a rule is matched and it's either 'ERROR' or 'CRITICAL'
//             if (logMessage && (logMessage.severity === 'ERROR' || logMessage.severity === 'CRITICAL')) {
//                 console.log(`Critical or Error rule triggered: ${logMessage.eventMessage}`);
//                 if (logMessage.businessType) {
//                     manager.toggleBusinessStatus(logMessage.businessType, 'disabled'); // Disable the business
//                     console.log(`Business type '${logMessage.businessType}' has been disabled due to severity.`);
//                 }
//             }
            
//             // Assuming we have the JSON data loaded into `jsonRules`
//             const matchedRule = logManager.evaluateLogMessage(`${line}`);
            
//             // If a rule is matched
//             if (matchedRule) {
//                 console.log(`Rule triggered: ${matchedRule}`);
//                 notificationManager.addNotification(matchedRule);

//                 // Create and add a new playbook with dynamic status
//                 // const statusOptions = ['pending', 'active', 'failed']; // Example status options
//                 // const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]; // Randomly select status
//                 const newPlaybook = {
//                     name: `${matchedRule.actionName}`,
//                     description: `Self-healing para ruleset #${matchedRule.id}`,
//                     lastUpdated: currentTime, // Add formatted datetime here
//                     status: 'active' // Dynamic status
//                 };

//                 playbookManager.addPlaybook(newPlaybook); // Add the new playbook immediately

//                 // Check if the matched rule affects a specific business type and update its status
//                 if (matchedRule.businessType) {
//                     manager.toggleBusinessStatus(matchedRule.businessType, 'operational'); // Disable the business
//                 }

//             }
            
//         } else {
//             logManager.addLogMessage(`No more lines to read.`);
//         }

//         networkManager.addNodeAndEdge(MESSAGE_INDEX, colors[MESSAGE_INDEX % colors.length]);

//         MESSAGE_INDEX++;

//     }, MESSAGE_LOGGING_INTERVAL);
// });
