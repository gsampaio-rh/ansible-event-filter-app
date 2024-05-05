export class PlaybookManager {
    constructor(container) {
        this.container = container;
        this.playbooks = [];
    }

    addPlaybook(playbook) {
        if (!playbook.name || !playbook.description || !playbook.status) {
            console.error('Invalid playbook data:', playbook);
            return;
        }

        const playbookCard = `
        <div class="playbook-card ${playbook.status} mb-3">
            <div class="playbook-card-body">
                <h5 class="playbook-card-title">${playbook.name}</h5>
                <p class="playbook-card-text">${playbook.description}</p>
                <p class="playbook-card-text"><strong>Status:</strong> ${playbook.status.charAt(0).toUpperCase() + playbook.status.slice(1)}</p>
            </div>
        </div>`;
        this.container.insertAdjacentHTML('afterbegin', playbookCard);
    }
}
