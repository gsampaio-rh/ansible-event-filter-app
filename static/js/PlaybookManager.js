export class PlaybookManager {
    constructor(container) {
        this.container = container;
        this.playbooks = [];
    }

    addPlaybook(playbook) {
        if (!playbook.name || !playbook.description || !playbook.status || !playbook.lastUpdated) {
            console.error('Invalid playbook data:', playbook);
            return;
        }

        const playbookCard = `
        <div class="playbook-card ${playbook.status} mb-3">
            <img src="/static/media/ansible.png" class="playbook-logo" alt="Ansible Logo">
            <div class="playbook-card-body">
                <h5 class="playbook-card-title">${playbook.name}</h5>
                <p class="playbook-card-text">${playbook.description}</p>
                <p class="playbook-card-text"><strong>Status:</strong> ${playbook.status.charAt(0).toUpperCase() + playbook.status.slice(1)}</p>
                <div class="playbook-date-time">Last Updated: ${playbook.lastUpdated}</div>
            </div>
        </div>`;
        this.container.insertAdjacentHTML('afterbegin', playbookCard);
    }
}