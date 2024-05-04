document.addEventListener('DOMContentLoaded', () => {

    const logContainer = document.getElementById('log-container');
    const networkContainer = document.getElementById('network');
    const filtroContainer = document.getElementById('notification-container');
    const playbooksContainer = document.getElementById('playbooks-container');


    if (!logContainer || !networkContainer || !filtroContainer || !playbooksContainer) {
        console.error("Required DOM elements are missing.");
        return; // Stop the script if essential elements are missing
    }

    // Constants for message and node handling
    const MESSAGE_LOGGING_INTERVAL = 3000; // Interval for logging messages
    const MESSAGE_REMOVAL_TIMEOUT = MESSAGE_LOGGING_INTERVAL * 20; // Time after which a message is removed
    const colors = ['#FFC107', '#03A9F4', '#4CAF50', '#E91E63', '#FFEB3B', '#009688', '#673AB7', '#3F51B5', '#FF5722', '#795548'];

    let notificationCounter = 0; // Counter to track the number of messages for triggering notifications
    let messageIndex = 1;
    let nodeIndex = 1;

    // Message Logger Functions
    function calculateMaxMessages(container) {
        const MESSAGE_HEIGHT = 20; // Average height of a log message in pixels
        return Math.floor(container.clientHeight / MESSAGE_HEIGHT);
    }

    // Network Visualization Functions
    function setupNetworkVisualization(nodes, edges) {
        const networkData = { nodes, edges };
        const networkOptions = {
            nodes: {
                shape: 'dot', // Shape of the nodes. 'dot' is a circle.
                size: 10, // Radius of the nodes.
                font: { size: 8, color: '#000000' }, // Font style for labels on the nodes.
                borderWidth: 2 // Width of the border around each node.
            },
            edges: {
                width: 2, // Thickness of the lines (edges) connecting nodes.
                color: {
                    color: '#848484', // Default color of edges.
                    highlight: '#848484', // Color of edges when they are highlighted.
                    hover: '#848484', // Color of edges when the mouse hovers over them.
                    opacity: 0.8 // Transparency of edges.
                }
            },
            physics: {
                // stabilization: { iterations: 10 }, // Number of iterations to stabilize the network before rendering.
                barnesHut: {
                    gravitationalConstant: -1500, // Negative value to make nodes repel each other.
                    centralGravity: 0.3, // Attracts nodes towards the center to avoid them going far off screen.
                    springLength: 100, // Natural length of the springs (edges), affecting how far apart nodes are.
                    springConstant: 0.01, // Stiffness of the springs, higher values make the springs stronger.
                    damping: 0.10, // Reduces the motion of nodes, making them stabilize faster.
                    avoidOverlap: 0.1 // Prevents nodes from overlapping.
                },
                solver: 'barnesHut' // The physics solver algorithm to use. Barnes-Hut is a performance-optimized approach.
            },
            layout: {
                improvedLayout: false // Whether to use an improved layout algorithm, which can provide better positioning but may be more computationally intensive.
            }
        };

        return new vis.Network(networkContainer, networkData, networkOptions);
    }

    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);
    const network = setupNetworkVisualization(nodes, edges);

    function addLogMessage(container, message, index) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'log-message';
        messageDiv.textContent = `#${index} ${message}`;
        messageDiv.style.display = 'block';

        if (container.firstChild) {
            container.insertBefore(messageDiv, container.firstChild);
        } else {
            container.appendChild(messageDiv);
        }

        setTimeout(() => {
            messageDiv.remove();
        }, MESSAGE_REMOVAL_TIMEOUT);

        const maxMessages = calculateMaxMessages(container);
        while (container.children.length > maxMessages) {
            container.removeChild(container.lastChild);
        }
    }

    function addNotification(message) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'notification';
        notificationDiv.innerHTML = `Events match! Potential issue <span class="issue-name">${message}</span> identified!`;

        // Check if there's already a first child and insert before it
        if (filtroContainer.firstChild) {
            filtroContainer.insertBefore(notificationDiv, filtroContainer.firstChild);
        } else {
            filtroContainer.appendChild(notificationDiv);
        }
    }

    // Sample playbook data
    const playbooks = [];

    // Function to create playbook card HTML and add it to the container
    function addPlaybook(playbook) {
        const playbookCard = `
            <div class="playbook-card mb-3">
                <div class="playbook-card-body">
                    <h5 class="playbook-card-title">${playbook.name}</h5>
                    <p class="playbook-card-text">${playbook.description}</p>
                    <p class="playbook-card-text"><strong>Status:</strong> ${playbook.status}</p>
                </div>
            </div>
        `;
        playbooksContainer.insertAdjacentHTML('afterbegin', playbookCard); // Insert at the beginning
    }

    // Combined function to handle both log messages and nodes
    setInterval(() => {
        const currentTime = new Date().toLocaleTimeString(); // Get current time for log message

        addLogMessage(logContainer, `Log message at ${currentTime}`, messageIndex++);

        nodes.add({ id: nodeIndex, label: `Node ${nodeIndex}`, color: colors[nodeIndex % colors.length] });
        if (nodeIndex > 1) {
            edges.add({ from: nodeIndex - 1, to: nodeIndex });
        }
        nodeIndex++;

        const newPlaybook = {
            name: `Playbook ${playbooks.length + 1}`,
            description: `Description of Playbook ${playbooks.length + 1}`,
            status: "Pending" // Status can be updated later
        };

        playbooks.push(newPlaybook);
        addPlaybook(newPlaybook); // Add the new playbook immediately

        // Add notification every 3 log messages
        if (++notificationCounter % 2 === 0) {
            addNotification(`Issue #${messageIndex - 1}`);
        }
    }, MESSAGE_LOGGING_INTERVAL);
});