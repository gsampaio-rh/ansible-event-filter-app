export class PlaybookManager {
    constructor(container) {
        this.container = container;
        this.playbooks = [];
        this.links = {
            "Falhas Críticas de Banco de Dados serviço de Cartões de Crédito": "https://aap-aap.apps.cluster-6gntq.6gntq.sandbox2343.opentlc.com/#/templates/job_template/16/details",
            "Investigação e Resolução de Tentativas de Login Após Falhas": "https://aap-aap.apps.cluster-6gntq.6gntq.sandbox2343.opentlc.com/#/templates/job_template/18/details",
            "Corrigir e Resolver Falha Crítica de Login em Mobile Banking": "https://aap-aap.apps.cluster-6gntq.6gntq.sandbox2343.opentlc.com/#/templates/job_template/13/details",
            "Otimização de Performance para Transações com Cartão de Crédito": "https://aap-aap.apps.cluster-6gntq.6gntq.sandbox2343.opentlc.com/#/templates/job_template/17/details",
            "Resolver Limites de Recursos em Contas Correntes": "https://aap-aap.apps.cluster-6gntq.6gntq.sandbox2343.opentlc.com/#/templates/job_template/15/details",
            "Revisão e Correção de Erros de API no Pix": "https://aap-aap.apps.cluster-6gntq.6gntq.sandbox2343.opentlc.com/#/templates/job_template/21/details"
        };
    }

    createPlaybook(matchedRule, currentTime) {
        return {
            name: `${matchedRule.actionName}`,
            description: `Playbook for rule set #${matchedRule.id}`,
            lastUpdated: currentTime,
            status: 'active'
        };
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
                <p class="playbook-card-text"><a href="${this.getAnsibleLink(playbook.name)}" target="_blank">${playbook.description}</a></p>
                <p class="playbook-card-text"><strong>Status:</strong> ${playbook.status.charAt(0).toUpperCase() + playbook.status.slice(1)}</p>
                <div class="playbook-date-time">Last Updated: ${playbook.lastUpdated}</div>
            </div>
        </div>`;
        this.container.insertAdjacentHTML('afterbegin', playbookCard);
    }

    getAnsibleLink(description) {
        for (const key in this.links) {
            if (description.includes(key)) {
                return this.links[key];
            }
        }
        return '#'; // Return a default or error link if no match is found
    }

}