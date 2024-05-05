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

        const img = document.createElement('img');
        img.src = business.icon;
        img.alt = "System Icon";
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