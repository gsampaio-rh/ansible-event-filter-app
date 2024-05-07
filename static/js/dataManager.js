// dataManager.js
import businessData from '../media/test-data/business-data.json' with { type: 'json' };
import architectureData from '../media/test-data/archdata.json' with { type: 'json' };

export function getBusinessData() {
    return businessData;
}

export function getArchitectureData() {
    return architectureData;
}
