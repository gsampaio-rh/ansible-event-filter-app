import { LogManager } from './LogManager.js';
import { NetworkManager } from './NetworkManager.js';
import { NotificationManager } from './NotificationManager.js';
import { PlaybookManager } from './PlaybookManager.js';
import { BusinessCardManager } from './BusinessCardManager.js';
import { ArchitectureManager } from './ArchitectureManager.js';
import { colors, MESSAGE_LOGGING_INTERVAL } from './config.js';

import { getBusinessData, getArchitectureData } from './dataManager.js'
import { setupSystemBoxHover, setupControlListeners } from './eventHandlers.js';
import { startInterval, stopInterval } from './intervalControl.js';

let fileLines = []; // To store lines fetched from logs
let currentLine = 0; // To keep track of the current line being processed
let MESSAGE_INDEX = 1; // To track the number of messages processed

const logContainer = document.getElementById('log-container');
const networkContainer = document.getElementById('network');
const notificationContainer = document.getElementById('notification-container');
const playbooksContainer = document.getElementById('playbooks-container');
const businessContainer = document.getElementById('business-container');

const businessData = getBusinessData();
const architectureData = getArchitectureData();

const logManager = new LogManager(logContainer);
const networkManager = new NetworkManager(networkContainer);
const notificationManager = new NotificationManager(notificationContainer);
const playbookManager = new PlaybookManager(playbooksContainer);
const businessManager = new BusinessCardManager('business-container', businessData);
const archManager = new ArchitectureManager('architecture-container', architectureData);

function handleLogMessageSeverity(logMessage) {
    if (!logMessage || (logMessage.severity !== 'ERROR' && logMessage.severity !== 'CRITICAL')) return;

    console.log(`Critical or Error rule triggered: ${logMessage.eventMessage}`);
    businessManager.toggleBusinessStatus(logMessage.businessType, 'disabled');
    archManager.toggleArchStatus(logMessage.businessType, 'disabled');
    console.log(`Business and architecture components related to ${logMessage.businessType} have been disabled.`);
}

function handleMatchedRule(logMessage, currentTime) {
    const matchedRule = logManager.evaluateLogMessage(logMessage);
    if (!matchedRule) return;

    console.log(`Rule triggered: ${matchedRule}`);
    notificationManager.addNotification(matchedRule);

    const newPlaybook = playbookManager.createPlaybook(matchedRule, currentTime);
    playbookManager.addPlaybook(newPlaybook);

    if (matchedRule.businessType) {
        businessManager.toggleBusinessStatus(matchedRule.businessType, 'operational');
        archManager.toggleArchStatus(matchedRule.businessType, 'operational');
    }
}

async function processLogLine() {
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    if (currentLine >= fileLines.length) {
        console.log("No more lines to read.");
        stopInterval();
        return;
    }

    const line = fileLines[currentLine++];
    try {
        const logMessage = logManager.addLogMessage(MESSAGE_INDEX, line);
        console.log(`#${MESSAGE_INDEX} Log message at ${currentTime}: ${line}`);

        handleLogMessageSeverity(logMessage);
        handleMatchedRule(line, currentTime);
        networkManager.addNodeAndEdge(MESSAGE_INDEX, colors[MESSAGE_INDEX % colors.length], logMessage.serviceName);

        MESSAGE_INDEX++;
    } catch (error) {
        console.error("Error processing log line: ", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    if (!logContainer || !networkContainer || !notificationContainer || !playbooksContainer || !businessContainer) {
        console.error("Required DOM elements are missing.");
        return;
    }

    async function fetchLogData() {
        try {
            const response = await fetch('/fetch-log');
            const data = await response.text();
            fileLines = data.split('\n');
            startInterval(processLogLine, MESSAGE_LOGGING_INTERVAL);
        } catch (error) {
            console.error("Failed to load log file", error);
        }
    }

    businessManager.populateBusinessContainer();
    archManager.populateArchitectureContainer();

    setupControlListeners(processLogLine, MESSAGE_LOGGING_INTERVAL);
    setupSystemBoxHover();
    fetchLogData(); // Start the log fetching and processing
});

