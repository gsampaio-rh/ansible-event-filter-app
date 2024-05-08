// RuleEngine.js
import ruleSetJsonData from '../media/test-data/demo-rulebook.json' with { type: 'json' };
import rulesJsonData from '../media/test-data/rules.json' with { type: 'json' };

export class RuleEngine {
    constructor() {
        
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