import ruleSetJsonData from '../media/test-data/demo-rulebook.json' with { type: 'json' };
import rulesJsonData from '../media/test-data/rules.json' with { type: 'json' };

// if (!ruleSetJsonData) {
//     console.error("Failed to load JSON data. Please check the path and server configuration.");
//     return; // Exit if data is not loaded
// }
export class LogManager {
    constructor(container) {
        this.container = container;
        this.messageIndex = 1;
    }

    calculateMaxMessages() {
        const MESSAGE_HEIGHT = 60; // Increased height to accommodate hidden details
        return Math.floor(this.container.clientHeight / MESSAGE_HEIGHT);
    }

    extractFieldsFromMessage(message) {
        const parts = message.split('|');
        return {
            datetime: parts[0].trim(),
            serviceName: parts[1].trim(),
            severity: parts[2].trim(),
            details: parts.slice(3, parts.length - 2).join(' | ').trim(),
            eventMessage: parts[parts.length - 3].trim(),
            source: parts[parts.length - 2].split(':')[1].trim(),
            businessType: parts[parts.length - 1].split(':')[1].trim()
        };
    }

    addLogMessage(id, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `log-message ${this.getMessageType(message)}`;
        messageDiv.innerHTML = this.formatMessage(id, message);

        // Extract the log message fields
        const fields = this.extractFieldsFromMessage(message);

        if (fields.severity === 'ERROR' || fields.severity === 'CRITICAL') {
            messageDiv.classList.add('error-flash'); // Add the class if the log is critical or an error
        }

        // Start the animation for the event message part
        const eventMessageDiv = messageDiv.querySelector('.log-event-message');
        const fullText = eventMessageDiv.textContent;
        eventMessageDiv.textContent = ''; // Ensure it's empty before starting animation
        this.animateText(eventMessageDiv, fullText);

        if (this.container.firstChild) {
            this.container.insertBefore(messageDiv, this.container.firstChild);
        } else {
            this.container.appendChild(messageDiv);
        }

        // Return the extracted fields from the log message as an object
        return fields;
    }

    getMessageType(message) {
        if (message.includes('CRITICAL')) {
            return 'critical';
        } else if (message.includes('WARNING')) {
            return 'warning';
        } else {
            return 'info'; // Default to info if no other type matches
        }
    }

    formatMessage(id, message) {
        const parts = message.split('|');
        const datetime = parts[0].trim();
        const eventName = parts[1].trim();
        const level = parts[2].trim();
        const details = parts.slice(3, parts.length - 2).join(' | ').trim();
        const eventMessage = parts[parts.length - 3].trim();
        const source = parts[parts.length - 2].split(':')[1].trim();
        const businessType = parts[parts.length - 1].split(':')[1].trim();

        return `
            <div class="log-message-header">
                <strong>${eventName}</strong>
                <div class="log-timestamp">#${id} - ${datetime}</div>
                <div class="log-event-message">${eventMessage} - ${businessType}</div>
            </div>
            <div class="log-details hidden">
                ${details}
            </div>
            <img src="/static/media/${source.toLowerCase().replace(/\s+/g, '')}.png" class="log-source-logo" alt="${source} logo">
        `;
    }

    animateText(element, text, index = 0) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => this.animateText(element, text, index + 1), 50); // Adjust timing to your liking
        }
    }

    listRules() {
        if (!ruleSetJsonData || !ruleSetJsonData.rules) {
            console.error('No rules data available');
            return;
        }

        console.log('Listing all rules:');
        ruleSetJsonData.rules.forEach((rule, index) => {
            console.log(`${index + 1}: ${rule.name}`);
            console.log(`  Condition: ${rule.condition}`);
            console.log(`  Action: ${JSON.stringify(rule.action, null, 2)}`);
        });
    }

    findRuleByName(ruleName) {
        // Use Array.find to locate the rule with the matching name
        const rule = rulesJsonData.results.find(rule => rule.name === ruleName);

        if (rule) {
            console.log('Rule found:', rule);
            return rule;
        } else {
            console.log('No rule found with the name:', ruleName);
            return null;
        }
    }

    evaluateLogMessage(logMessage) {
        const logPattern = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \| (.+?) \| (\w+) \| (.+?) \| (.+?) \| Source: (.+)/;
        const match = logMessage.match(logPattern);
        if (!match) {
            console.error('Log message format is incorrect');
            return null;
        }
        const [, timestamp, service, severity, details, message, source] = match;

        // Parsing details further to extract 'system', 'userID', etc.
        const detailParts = details.split(', ').reduce((acc, part) => {
            const [key, value] = part.split(': ');
            acc[key.trim().toLowerCase().replace(/ /g, '_')] = value.trim();
            return acc;
        }, {});

        const payload = {
            system: service,
            severity: severity,
            message: message,
            ...detailParts
        };

        // Check against each rule in JSON
        for (let rule of ruleSetJsonData.rules) {
            // Replace placeholders and logical operators in the condition with actual payload data
            let condition = rule.condition
                .replace(/event.payload\.([a-zA-Z_]+)/g, (match, p1) => {
                    return `payload['${p1}']`;
                })
                .replace(/ and /g, ' && ')
                .replace(/ or /g, ' || ');

            // Safely evaluate condition - Note: This is a basic implementation and may need more security considerations
            try {
                if (eval(condition)) {
                    console.log(`Rule matched: ${rule.name}`);
                    const ruleData = this.findRuleByName(rule.name);
                    if (ruleData) {
                        // Enhance rule object with additional details
                        const enhancedRule = {
                            ...rule,
                            id: ruleData.id,
                            name: ruleData.name,
                            actionName: ruleData.action.run_job_template.name,
                            businessType: ruleData.action.run_job_template.job_args.extra_vars.business_type
                        };
                        console.log('Enhanced Rule Details:', enhancedRule);
                        return enhancedRule;
                    }
                    
                    // return rule; // Returning the matched rule object
                }
                else {
                    // console.log(`No rule founded`);
                }
            } catch (error) {
                console.error('Error evaluating condition:', error);
            }
        }

        return null; // No rule matched
    }

}
