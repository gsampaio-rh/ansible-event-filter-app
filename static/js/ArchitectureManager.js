export class ArchitectureManager {
    constructor(containerId, componentData) {
        this.container = document.getElementById(containerId);
        this.componentData = componentData;
    }

    createArchCard(component) {
        const column = document.createElement('div');
        column.className = 'col-md-3 system-box';
        if (this.componentData.indexOf(component) <= 3) {
            column.classList.add('column-border');
        }

        const card = document.createElement('div');
        card.className = 'system-card';
        card.setAttribute('data-id', component.system);  // Unique identifier
        card.setAttribute('data-active', component.status === 'operational');

        const img = document.createElement('img');
        img.src = component.icon;
        img.alt = `${component.name} Icon`;
        img.className = "system-icon";

        const infoDiv = document.createElement('div');
        infoDiv.className = 'system-info';

        const nameH3 = document.createElement('h3');
        nameH3.className = 'system-name';
        nameH3.textContent = component.name;

        const statusDiv = document.createElement('div');
        statusDiv.className = 'system-status';
        statusDiv.setAttribute('data-status', component.status);
        statusDiv.textContent = component.status.charAt(0).toUpperCase() + component.status.slice(1);

        const modalDiv = document.createElement('div');
        modalDiv.className = 'system-modal hidden';   
        modalDiv.textContent = component.modal;

        infoDiv.appendChild(nameH3);
        // infoDiv.appendChild(statusDiv);
        infoDiv.appendChild(modalDiv);

        card.appendChild(img);
        card.appendChild(infoDiv);
        column.appendChild(card);

        card.addEventListener('click', () => {
            const isActive = card.getAttribute('data-active') === 'true';
            this.toggleArchCardState(component.system, !isActive);
        });

        return column;
    }

    toggleArchStatus(system, newStatus) {
        this.componentData = this.componentData.map(component => {
            if (component.system === system) {
                component.status = newStatus; // Update the status
                // Update UI for the specific component card
                const componentCard = this.container.querySelector(`.system-card[data-id='${system}']`);
                if (componentCard) {
                    const statusDiv = componentCard.querySelector('.system-status');
                    // statusDiv.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                    // statusDiv.style.color = newStatus === 'operational' ? 'green' : 'red'; // Change color based on status
                    componentCard.classList.toggle('disabled', newStatus !== 'operational');
                }
            }
            return component;
        });
    }

    toggleArchCardState(componentId, isActive) {
        const componentCards = this.container.querySelectorAll('.system-card');
        componentCards.forEach(card => {
            if (card.getAttribute('data-id') === componentId) {
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
                this.updateArchStatus(componentId, newStatus);
            }
        });
    }

    updateArchStatus(system, newStatus) {
        const component = this.componentData.find(b => b.system === system);
        if (component) {
            component.status = newStatus;
        }
    }

    populateArchitectureContainer() {
        let row = document.createElement('div');
        row.className = 'row system-row';
        this.componentData.forEach((component, index) => {
            const componentCard = this.createArchCard(component);
            row.appendChild(componentCard);
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
