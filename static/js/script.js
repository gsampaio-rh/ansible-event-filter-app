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
        modal: "API is currently operational. Latency SLO is met with 99.99% No issues reported.",
        icon: "../static/media/api.png"
    },
    {
        name: "Banco de Dados",
        system: "conta_corrente",
        status: "operational",
        modal: "DB is currently operational. Availability SLO is met with 99.999% No issues reported.",
        icon: "../static/media/db.png"
    },
    {
        name: "Kafka",
        system: "mobile_banking",
        status: "operational",
        modal: "Kafka is currently operational. Replication SLO is met with 99.99% No issues reported.",
        icon: "../static/media/kafkaicon.png"
    },
    {
        name: "Integrador Banco Central",
        system: "pix",
        status: "operational",
        modal: "Camel Route is currently operational. Latency SLO is met with 99.9999% No issues reported.",
        icon: "../static/media/fuse.png"
    }
];

const logContainer = document.getElementById('log-container');
const networkContainer = document.getElementById('network');
const notificationContainer = document.getElementById('notification-container');
const playbooksContainer = document.getElementById('playbooks-container');
const businessContainer = document.getElementById('business-container');

const logManager = new LogManager(logContainer);
const networkManager = new NetworkManager(networkContainer);
const notificationManager = new NotificationManager(notificationContainer);
const playbookManager = new PlaybookManager(playbooksContainer);
const manager = new BusinessCardManager('business-container', businessData);
const archManager = new ArchitectureManager('architecture-container', architectureData);

// Function definitions for starting and stopping the interval
function startInterval() {
    intervalID = setInterval(processLogLine, MESSAGE_LOGGING_INTERVAL);
    console.log(`Interval started at #${currentLine}.`);
}

function stopInterval() {
    clearInterval(intervalID);
    console.log(`Interval stopped at #${currentLine}.`);
}

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
                description: `Playbook para conjunto de regras #${matchedRule.id}`,
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

        networkManager.addNodeAndEdge(MESSAGE_INDEX, colors[MESSAGE_INDEX % colors.length], logMessage.serviceName);
        MESSAGE_INDEX++;

    } else {
        console.log("No more lines to read.");
        stopInterval(); // Stop the interval if no more lines to process
    }
}

document.addEventListener('DOMContentLoaded', () => {

    if (!logContainer || !networkContainer || !notificationContainer || !playbooksContainer || !businessContainer) {
        console.error("Required DOM elements are missing.");
        return;
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

    manager.populateBusinessContainer();
    archManager.populateArchitectureContainer();
    fetchLogData(); // Start the log fetching and processing
});

document.getElementById('toggleButton').addEventListener('click', function () {
    var button = this;
    if (button.textContent === 'Stop') {
        console.log(`Stopping at  #${currentLine}`);
        stopInterval();
        // console.log(`Stopped at  ${currentLine}`);
        button.textContent = 'Start';  // Change text to Stop
        button.classList.remove('btn-danger');
        button.classList.add('btn-primary');  // Optionally change color to red
    } else {
        console.log(`Starting at  #${currentLine}`);
        startInterval();
        // console.log(`Starting at  ${currentLine}`);
        button.textContent = 'Stop'; // Change text to Start
        button.classList.remove('btn-primary');
        button.classList.add('btn-danger');  // Optionally change color to blue
    }
});

document.querySelectorAll('.system-box').forEach(box => {
    box.addEventListener('mouseenter', function () {
        this.querySelector('.system-modal').style.display = 'block';
    });
    box.addEventListener('mouseleave', function () {
        this.querySelector('.system-modal').style.display = 'none';
    });
});
