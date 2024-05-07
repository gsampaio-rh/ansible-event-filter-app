// import { Network, DataSet } from 'vis-network'; (make sure this import line is uncommented and correctly set up)

export class NetworkManager {
    constructor(container) {
        // Store nodes and edges as instance properties
        this.nodes = new vis.DataSet([]);
        this.edges = new vis.DataSet([]);
        this.network = this.setupNetworkVisualization(container, this.nodes, this.edges);
    }

    setupNetworkVisualization(container, nodes, edges) {
        const networkData = { nodes, edges };
        const networkOptions = {
            nodes: {
                shape: 'dot',
                size: 5,
                font: { size: 8, color: '#000000' },
                borderWidth: 2
            },
            edges: {
                width: 2,
                color: {
                    color: '#848484',
                    highlight: '#848484',
                    hover: '#848484',
                    opacity: 0.8
                }
            },
            physics: {
                barnesHut: {
                    gravitationalConstant: -1500,
                    centralGravity: 0.3,
                    springLength: 10,
                    springConstant: 0.01,
                    damping: 2,
                    avoidOverlap: 0
                },
                solver: 'barnesHut'
            },
            layout: {
                improvedLayout: false
            }
        };

        return new vis.Network(container, networkData, networkOptions);
    }

    addNodeAndEdge(nodeIndex, color, message) {
        // Access nodes and edges using this.nodes and this.edges
        this.nodes.add({ id: nodeIndex, label: `#${nodeIndex} ${message}`, color: color });
        if (nodeIndex > 1) {
            this.edges.add({ from: nodeIndex - 1, to: nodeIndex });
        }
    }
    
}
