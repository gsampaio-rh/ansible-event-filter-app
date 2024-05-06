export class ArchitectureManager {
    constructor(containerId, businessData) {
        this.container = document.getElementById(containerId);
        this.businessData = businessData;
    }

    createArchCard(business) {
        const column = document.createElement('div');
        column.className = 'col-md-3 system-box';
        if (this.businessData.indexOf(business) <= 3) {
            column.classList.add('column-border');
        }

        const card = document.createElement('div');
        card.className = 'system-card';
        card.setAttribute('data-id', business.system);  // Unique identifier
        card.setAttribute('data-active', business.status === 'operational');

        const img = document.createElement('img');
        img.src = business.icon;
        img.alt = `${business.name} Icon`;
        img.className = "system-icon";

        const infoDiv = document.createElement('div');
        infoDiv.className = 'system-info';

        const nameH3 = document.createElement('h3');
        nameH3.className = 'system-name';
        nameH3.textContent = business.name;

        const statusDiv = document.createElement('div');
        statusDiv.className = 'system-status';
        statusDiv.setAttribute('data-status', business.status);
        statusDiv.textContent = business.status.charAt(0).toUpperCase() + business.status.slice(1);

        const modalDiv = document.createElement('div');
        modalDiv.className = 'system-modal hidden';   
        modalDiv.textContent = business.modal;

        infoDiv.appendChild(nameH3);
        // infoDiv.appendChild(statusDiv);
        infoDiv.appendChild(modalDiv);

        card.appendChild(img);
        card.appendChild(infoDiv);
        column.appendChild(card);

        card.addEventListener('click', () => {
            const isActive = card.getAttribute('data-active') === 'true';
            this.toggleArchCardState(business.system, !isActive);
        });

        return column;
    }

    toggleArchStatus(system, newStatus) {
        this.businessData = this.businessData.map(business => {
            if (business.system === system) {
                business.status = newStatus; // Update the status
                // Update UI for the specific business card
                const businessCard = this.container.querySelector(`.system-card[data-id='${system}']`);
                if (businessCard) {
                    const statusDiv = businessCard.querySelector('.system-status');
                    // statusDiv.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                    // statusDiv.style.color = newStatus === 'operational' ? 'green' : 'red'; // Change color based on status
                    businessCard.classList.toggle('disabled', newStatus !== 'operational');
                }
            }
            return business;
        });
    }

    toggleArchCardState(businessId, isActive) {
        const businessCards = this.container.querySelectorAll('.system-card');
        businessCards.forEach(card => {
            if (card.getAttribute('data-id') === businessId) {
                const newStatus = isActive ? 'operational' : 'disabled';
                card.setAttribute('data-active', isActive);
                card.querySelector('.system-status').textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                card.querySelector('.system-status').style.color = isActive ? 'green' : 'red';
                if (!isActive) {
                    card.classList.add('disabled');
                } else {
                    card.classList.remove('disabled');
                }
                // Update internal data model
                this.updateArchStatus(businessId, newStatus);
            }
        });
    }

    updateArchStatus(system, newStatus) {
        const business = this.businessData.find(b => b.system === system);
        if (business) {
            business.status = newStatus;
        }
    }

    populateArchitectureContainer() {
        let row = document.createElement('div');
        row.className = 'row system-row';
        this.businessData.forEach((business, index) => {
            const businessCard = this.createArchCard(business);
            row.appendChild(businessCard);
            if ((index + 1) % 4 === 0) { // After every two cards, append the row to the container and create a new row
                this.container.appendChild(row);
                row = document.createElement('div');
                row.className = 'row';
            }
        });
        if (row.hasChildNodes()) { // Add the last row if it has any children left
            this.container.appendChild(row);
        }
    }
}
