//PlaybookManager.js
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

    addPlaybook(id, playbook) {
        if (!playbook.name || !playbook.description || !playbook.status || !playbook.lastUpdated) {
            console.error('Invalid playbook data:', playbook);
            return;
        }

        const playbookCard = `
        <div id="playbook-card-${id}" class="playbook-card ${playbook.status} mb-3">
            <img src="/static/media/ansible.png" class="playbook-logo" alt="Ansible Logo">
            <div class="playbook-card-body">
                <h5 class="playbook-card-title">${playbook.name}</h5>
                <p class="playbook-card-text"><a href="${this.getAnsibleLink(playbook.name)}" target="_blank">${playbook.description}</a></p>
                <p class="playbook-card-text"><strong>Status:</strong> ${playbook.status.charAt(0).toUpperCase() + playbook.status.slice(1)}</p>
                <div class="playbook-date-time">Last Updated: ${playbook.lastUpdated}</div>
            </div>
        </div>`;
        this.container.insertAdjacentHTML('afterbegin', playbookCard);

        // Adding hover events after the element is added to the DOM
        const addedElement = this.container.querySelector('.playbook-card:first-child');
        this.addHoverEffect(addedElement, id);
    }

    addHoverEffect(element, playbookId) {
        element.addEventListener('mouseenter', () => {
            element.style.backgroundColor = 'rgba(245, 245, 245, 0.8)'; // Light grey background on hover
            this.adjustLogMessagesOpacity(playbookId, 0.3); // Make all other log messages opaque
        });
        element.addEventListener('mouseleave', () => {
            element.style.backgroundColor = ''; // Reset background when mouse leaves
            this.resetLogMessagesOpacity();
        });
    }

    adjustLogMessagesOpacity(exceptId, opacity) {
        // Select all log messages and notification divs
        const allLogMessages = document.querySelectorAll('.log-message');
        const allNotificationDivs = document.querySelectorAll('.notification');

        // Adjust opacity for log messages
        allLogMessages.forEach(msg => {
            if (msg.id !== `log-message-${exceptId}`) {
                msg.style.opacity = opacity; // Make other log messages opaque
            } else {
                // msg.style.border = '2px solid blue'; // Optionally highlight the associated log message
            }
        });

        // Adjust opacity for notification divs
        allNotificationDivs.forEach(div => {
            if (div.id !== `notification-${exceptId}`) {
                div.style.opacity = opacity; // Make all notification divs opaque
            } else {
                // msg.style.border = '2px solid blue'; // Optionally highlight the associated log message
            }
        });
    }

    resetLogMessagesOpacity() {
        // Reset opacity and styles for log messages
        const allLogMessages = document.querySelectorAll('.log-message');
        const allNotificationDivs = document.querySelectorAll('.notification');

        allLogMessages.forEach(msg => {
            msg.style.opacity = ''; // Reset opacity to default
            // msg.style.border = ''; // Remove any border highlights
        });

        // Reset opacity for notification divs
        allNotificationDivs.forEach(div => {
            div.style.opacity = ''; // Reset opacity to default
        });
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