export class BusinessCardManager {
    constructor(containerId, businessData) {
        this.container = document.getElementById(containerId);
        this.businessData = businessData;
    }

    createBusinessCard(business) {
        const column = document.createElement('div');
        column.className = 'col-md-6 business-box';
        if (this.businessData.indexOf(business) % 2 === 0) { // Adds border to every even index item
            column.classList.add('column-border');
        }

        const card = document.createElement('div');
        card.className = 'business-card';
        card.innerHTML = `
            <img src="${business.icon}" alt="System Icon" class="business-icon">
            <div class="business-info">
                <h3 class="business-name">${business.name}</h3>
                <div class="business-status" data-status="${business.status}">
                    ${business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                </div>
            </div>
        `;
        column.appendChild(card);
        return column;
    }

    populateBusinessContainer() {
        let row = document.createElement('div');
        row.className = 'row border-bottom';
        this.businessData.forEach((business, index) => {
            const businessCard = this.createBusinessCard(business);
            row.appendChild(businessCard);
            if (index % 2 !== 0) { // After every two cards, append the row to the container and create a new row
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