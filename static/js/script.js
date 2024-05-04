document.addEventListener('DOMContentLoaded', () => {
    const logContainer = document.getElementById('log-container');
    const networkContainer = document.getElementById('network');

    if (!logContainer || !networkContainer) {
        console.error("Required DOM elements are missing.");
        return; // Stop the script if essential elements are missing
    }

    // Constants for message and node handling
    const MESSAGE_LOGGING_INTERVAL = 3000; // Interval for logging messages
    const MESSAGE_REMOVAL_TIMEOUT = MESSAGE_LOGGING_INTERVAL * 10; // Time after which a message is removed
    const colors = ['#FFC107', '#03A9F4', '#4CAF50', '#E91E63', '#FFEB3B', '#009688', '#673AB7', '#3F51B5', '#FF5722', '#795548'];

    // Message Logger Functions
    function calculateMaxMessages(container) {
        const MESSAGE_HEIGHT = 20; // Average height of a log message in pixels
        return Math.floor(container.clientHeight / MESSAGE_HEIGHT);
    }

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

    /// Network Visualization Functions
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
                stabilization: { iterations: 10 }, // Number of iterations to stabilize the network before rendering.
                barnesHut: {
                    gravitationalConstant: -1500, // Negative value to make nodes repel each other.
                    centralGravity: 0.3, // Attracts nodes towards the center to avoid them going far off screen.
                    springLength: 100, // Natural length of the springs (edges), affecting how far apart nodes are.
                    springConstant: 0.01, // Stiffness of the springs, higher values make the springs stronger.
                    damping: 0.20, // Reduces the motion of nodes, making them stabilize faster.
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

    let messageIndex = 1;
    let nodeIndex = 1;

    // Combined function to handle both log messages and nodes
    setInterval(() => {
        const currentTime = new Date().toLocaleTimeString(); // Get current time for log message
        addLogMessage(logContainer, `Log message at ${currentTime}`, messageIndex++);
        nodes.add({ id: nodeIndex, label: `Node ${nodeIndex}`, color: colors[nodeIndex % colors.length] });
        if (nodeIndex > 1) {
            edges.add({ from: nodeIndex - 1, to: nodeIndex });
        }
        nodeIndex++;
    }, MESSAGE_LOGGING_INTERVAL);
});