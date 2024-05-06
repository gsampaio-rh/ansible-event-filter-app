export class BusinessCardManager {
    constructor(containerId, businessData) {
        this.container = document.getElementById(containerId);
        this.businessData = businessData;
    }

    createBusinessCard(business) {
        const column = document.createElement('div');
        column.className = 'col-md-6 business-box';
        if (this.businessData.indexOf(business) % 2 === 0) {
            column.classList.add('column-border');
        }

        const card = document.createElement('div');
        card.className = 'business-card';
        card.setAttribute('data-id', business.system);  // Unique identifier
        card.setAttribute('data-active', business.status === 'operational');

        const img = document.createElement('img');
        img.src = business.icon;
        img.alt = `${business.name} Icon`;
        img.className = "business-icon";

        const infoDiv = document.createElement('div');
        infoDiv.className = 'business-info';

        const nameH3 = document.createElement('h3');
        nameH3.className = 'business-name';
        nameH3.textContent = business.name;

        const statusDiv = document.createElement('div');
        statusDiv.className = 'business-status';
        statusDiv.setAttribute('data-status', business.status);
        statusDiv.textContent = business.status.charAt(0).toUpperCase() + business.status.slice(1);

        infoDiv.appendChild(nameH3);
        infoDiv.appendChild(statusDiv);

        card.appendChild(img);
        card.appendChild(infoDiv);
        column.appendChild(card);

        card.addEventListener('click', () => {
            const isActive = card.getAttribute('data-active') === 'true';
            this.toggleBusinessCardState(business.system, !isActive);
        });

        return column;
    }

    toggleBusinessStatus(system, newStatus) {
        this.businessData = this.businessData.map(business => {
            if (business.system === system) {
                business.status = newStatus; // Update the status
                // Update UI for the specific business card
                const businessCard = this.container.querySelector(`.business-card[data-id='${system}']`);
                if (businessCard) {
                    const statusDiv = businessCard.querySelector('.business-status');
                    statusDiv.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                    statusDiv.style.color = newStatus === 'operational' ? 'green' : 'red'; // Change color based on status
                    businessCard.classList.toggle('disabled', newStatus !== 'operational');
                }
            }
            return business;
        });
    }

    toggleBusinessCardState(businessId, isActive) {
        const businessCards = this.container.querySelectorAll('.business-card');
        businessCards.forEach(card => {
            if (card.getAttribute('data-id') === businessId) {
                const newStatus = isActive ? 'operational' : 'disabled';
                card.setAttribute('data-active', isActive);
                card.querySelector('.business-status').textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                card.querySelector('.business-status').style.color = isActive ? 'green' : 'red';
                if (!isActive) {
                    card.classList.add('disabled');
                } else {
                    card.classList.remove('disabled');
                }
                // Update internal data model
                this.updateBusinessStatus(businessId, newStatus);
            }
        });
    }

    updateBusinessStatus(system, newStatus) {
        const business = this.businessData.find(b => b.system === system);
        if (business) {
            business.status = newStatus;
        }
    }

    populateBusinessContainer() {
        let row = document.createElement('div');
        row.className = 'row border-bottom';
        this.businessData.forEach((business, index) => {
            const businessCard = this.createBusinessCard(business);
            row.appendChild(businessCard);
            if ((index + 1) % 2 === 0) { // After every two cards, append the row to the container and create a new row
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
