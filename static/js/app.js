//app.js
import { colors, MESSAGE_LOGGING_INTERVAL } from './config.js';
import { getBusinessData, getArchitectureData } from './dataManager.js'
import { setupSystemBoxHover, setupControlListeners } from './eventHandlers.js';
import { startInterval, stopInterval } from './intervalControl.js';
import { getCurrentLine, advanceCurrentLine, getMessageIndex, incrementMessageIndex, getFileLines, setFileLines } from './stateManager.js';

import { LogManager } from './LogManager.js';
import { NetworkManager } from './NetworkManager.js';
import { NotificationManager } from './NotificationManager.js';
import { PlaybookManager } from './PlaybookManager.js';
import { BusinessCardManager } from './BusinessCardManager.js';
import { ArchitectureManager } from './ArchitectureManager.js';
import { RuleEngine } from './RuleEngine.js';

const logContainer = document.getElementById('log-container');
const networkContainer = document.getElementById('network');
const notificationContainer = document.getElementById('notification-container');
const playbooksContainer = document.getElementById('playbooks-container');
const businessContainer = document.getElementById('business-container');

const businessData = getBusinessData();
const architectureData = getArchitectureData();

const networkManager = new NetworkManager(networkContainer);
const logManager = new LogManager(document.getElementById('log-container'), networkManager);
const notificationManager = new NotificationManager(notificationContainer);
const playbookManager = new PlaybookManager(playbooksContainer);
const businessManager = new BusinessCardManager('business-container', businessData);
const archManager = new ArchitectureManager('architecture-container', architectureData);
const ruleEngine = new RuleEngine();


function handleLogMessageSeverity(logMessage) {
    if (!logMessage || (logMessage.severity !== 'ERROR' && logMessage.severity !== 'CRITICAL')) return;

    console.log(`Critical or Error rule triggered: ${logMessage.eventMessage}`);
    businessManager.toggleBusinessStatus(logMessage.businessType, 'disabled');
    archManager.toggleArchStatus(logMessage.businessType, 'disabled');
    console.log(`Business and architecture components related to ${logMessage.businessType} have been disabled.`);
}

function handleMatchedRule(logMessage, currentTime) {
    const matchedRule = ruleEngine.evaluateLogMessage(logMessage);
    if (!matchedRule) return;

    console.log(`Rule triggered: ${matchedRule}`);
    notificationManager.addNotification(matchedRule);

    const newPlaybook = playbookManager.createPlaybook(matchedRule, currentTime);
    playbookManager.addPlaybook(newPlaybook);

    if (matchedRule.businessType) {
        businessManager.toggleBusinessStatus(matchedRule.businessType, 'operational');
        archManager.toggleArchStatus(matchedRule.businessType, 'operational');
    }

    logManager.removeErrorFlash(getMessageIndex());
}

async function processLogLine() {
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    if (getCurrentLine() >= getFileLines().length) {
        console.log("No more lines to read.");
        stopInterval();
        return;
    }

    const line = getFileLines()[getCurrentLine()];
    advanceCurrentLine();
    try {
        const logMessage = logManager.addLogMessage(getMessageIndex(), line);
        console.log(`#${getMessageIndex()} Log message at ${currentTime}: ${line}`);

        handleLogMessageSeverity(logMessage);
        handleMatchedRule(line, currentTime);
        networkManager.addNodeAndEdge(getMessageIndex(), colors[getMessageIndex() % colors.length], logMessage.serviceName);

        incrementMessageIndex();
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
            setFileLines(data.split('\n'));
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
