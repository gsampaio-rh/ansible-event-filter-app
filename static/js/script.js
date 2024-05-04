// Constants for message and node handling
const MESSAGE_LOGGING_INTERVAL = 3000; // Interval for logging messages
const MESSAGE_REMOVAL_TIMEOUT = MESSAGE_LOGGING_INTERVAL * 10; // Time after which a message is removed
const colors = ['#FFC107', '#03A9F4', '#4CAF50', '#E91E63', '#FFEB3B', '#009688', '#673AB7', '#3F51B5', '#FF5722', '#795548'];

document.addEventListener('DOMContentLoaded', () => {
    const logContainer = document.getElementById('log-container');
    console.log("Log Container selected:", logContainer); // Debug: Confirm the log container is selected

    // Utility function to calculate the maximum number of log messages that can fit in the container
    function calculateMaxMessages(container) {
        const MESSAGE_HEIGHT = 20; // Average height of a log message in pixels
        return Math.floor(container.clientHeight / MESSAGE_HEIGHT);
    }

    // Initial setup for the network visualization
    const container = document.getElementById('network');
    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);
    const networkData = { nodes, edges };
    const networkOptions = {
        nodes: {
            shape: 'dot',
            size: 10,
            font: { size: 8, color: '#000000' },
            borderWidth: 2
        },
        edges: {
            width: 2,
            color: { color: '#848484', highlight: '#848484', hover: '#848484', opacity: 0.8 }
        },
        physics: {
            stabilization: { iterations: 150 },
            barnesHut: {
                gravitationalConstant: -1500,
                centralGravity: 0.3,
                springLength: 100,
                springConstant: 0.01,
                damping: 0.09,
                avoidOverlap: 0.1
            },
            solver: 'barnesHut'
        },
        layout: {
            improvedLayout: false
        }
    };
    const network = new vis.Network(container, networkData, networkOptions);
    network.once('stabilizationIterationsDone', () => {
        network.fit({
            nodes: nodes.getIds(),
            scale: 2.0,
            animation: { duration: 500, easingFunction: "easeOutQuad" }
        });
    });

    let messageIndex = 1; // Unique index for log messages
    let nodeIndex = 1; // Unique index for nodes

    // Function to add a log message with a unique ID
    // Function to add a log message with a unique ID at the top of the container
    function addLogMessage(container, message, index) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'log-message';
        messageDiv.textContent = `#${index} ${message}`;
        messageDiv.style.display = 'block'; // Ensure the message is visible

        // Insert the new message at the beginning of the log container
        if (container.firstChild) {
            container.insertBefore(messageDiv, container.firstChild);
        } else {
            container.appendChild(messageDiv);
        }

        // Remove the message after a specified timeout
        setTimeout(() => {
            messageDiv.remove();
        }, MESSAGE_REMOVAL_TIMEOUT);

        // Adjust the message count as needed
        const maxMessages = calculateMaxMessages(container);
        while (container.children.length > maxMessages) {
            container.removeChild(container.lastChild);
        }
    }

    // Function to add nodes to the network indefinitely
    function addNode(nodes, edges, index) {
        nodes.add({ id: index, label: `Node ${index}`, color: colors[index % colors.length] });
        if (index > 1) {
            edges.add({ from: index - 1, to: index });
        }
    }

    // Combined function to handle both log messages and nodes
    setInterval(() => {
        const currentTime = new Date().toLocaleTimeString(); // Get current time for log message
        addLogMessage(logContainer, `Log message at ${currentTime}`, messageIndex++);
        addNode(nodes, edges, nodeIndex++);
    }, MESSAGE_LOGGING_INTERVAL);
});
