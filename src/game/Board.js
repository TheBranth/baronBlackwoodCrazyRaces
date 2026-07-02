const nodes = [
    { id: 'amber_coast', name: 'Amber Coast', x: 350, y: 180, connections: ['windengate', 'tulip_fields'] },
    { id: 'windengate', name: 'Windengate', x: 400, y: 250, connections: ['amber_coast', 'tulip_fields', 'canal_crossing'] },
    { id: 'tulip_fields', name: 'Tulip Fields', x: 480, y: 200, connections: ['amber_coast', 'windengate', 'port_of_tulips', 'clover_hollow'] },
    { id: 'port_of_tulips', name: 'Port of Tulips', x: 550, y: 150, connections: ['tulip_fields', 'clover_hollow', 'wind_mills', 'damswyck'] },
    { id: 'clover_hollow', name: 'Clover Hollow', x: 650, y: 120, connections: ['tulip_fields', 'port_of_tulips', 'north_haven'] },
    { id: 'north_haven', name: 'North-Haven', x: 850, y: 120, connections: ['clover_hollow', 'wind_mills', 'hearthmeadow'] },
    { id: 'wind_mills', name: 'Wind Mills', x: 700, y: 200, connections: ['port_of_tulips', 'north_haven', 'damswyck', 'hearthmeadow'] },
    { id: 'damswyck', name: 'Damswyck', x: 600, y: 280, connections: ['port_of_tulips', 'wind_mills', 'hearthmeadow', 'dunes_edge', 'diamond_port', 'canal_crossing'] },
    { id: 'canal_crossing', name: 'Canal Crossing', x: 380, y: 350, connections: ['windengate', 'damswyck', 'weavers_guild'] },
    { id: 'weavers_guild', name: 'Weavers Guild', x: 360, y: 460, connections: ['canal_crossing', 'the_shifting_isles', 'chocolat_bourg'] },
    { id: 'the_shifting_isles', name: 'The Shifting Isles', x: 450, y: 450, connections: ['weavers_guild', 'chocolat_bourg', 'diamond_port'] },
    { id: 'diamond_port', name: 'Diamond Port', x: 500, y: 380, connections: ['damswyck', 'the_shifting_isles', 'dunes_edge', 'chocolat_bourg', 'crossroads'] },
    { id: 'dunes_edge', name: 'Dunes Edge', x: 620, y: 400, connections: ['damswyck', 'diamond_port', 'hearthmeadow', 'reed_river'] },
    { id: 'hearthmeadow', name: 'Hearthmeadow', x: 750, y: 350, connections: ['north_haven', 'wind_mills', 'damswyck', 'dunes_edge', 'misty_woods'] },
    { id: 'misty_woods', name: 'Misty Woods', x: 800, y: 440, connections: ['hearthmeadow', 'hillsfort', 'reed_river'] },
    { id: 'reed_river', name: 'Reed River', x: 700, y: 480, connections: ['dunes_edge', 'misty_woods', 'crossroads', 'iron_valley', 'hillsfort'] },
    { id: 'crossroads', name: 'Crossroads', x: 580, y: 460, connections: ['diamond_port', 'reed_river', 'chocolat_bourg', 'iron_valley'] },
    { id: 'chocolat_bourg', name: 'Chocolat Bourg', x: 520, y: 520, connections: ['weavers_guild', 'the_shifting_isles', 'diamond_port', 'crossroads', 'iron_valley'] },
    { id: 'iron_valley', name: 'Iron Valley', x: 680, y: 580, connections: ['crossroads', 'chocolat_bourg', 'reed_river', 'hillsfort'] },
    { id: 'hillsfort', name: 'Hillsfort', x: 820, y: 520, connections: ['misty_woods', 'reed_river', 'iron_valley'] }
];

export default class Board {
    constructor() {
        this.nodes = nodes;
    }

    getNodes() {
        return this.nodes;
    }

    findNodeById(id) {
        return this.nodes.find(node => node.id === id);
    }

    /**
     * Finds all nodes reachable from a starting node in a specific number of steps.
     * Uses a path-based Breadth-First Search (BFS) to prevent immediate backtracking
     * while allowing loops and alternative paths.
     * @param {string} startNodeId The ID of the starting node.
     * @param {number} steps The exact number of steps to travel.
     * @returns {Array<string>} An array of node IDs that are exactly `steps` away.
     */
    getPossibleMoves(startNodeId, steps) {
        const startNode = this.findNodeById(startNodeId);
        if (!startNode) {
            return [];
        }

        const queue = [{ nodeId: startNodeId, stepsRemaining: steps, parentId: null }];
        const possibleMoves = new Set();

        while (queue.length > 0) {
            const { nodeId, stepsRemaining, parentId } = queue.shift();

            if (stepsRemaining === 0) {
                possibleMoves.add(nodeId);
                continue;
            }

            const currentNode = this.findNodeById(nodeId);
            if (!currentNode) {
                continue;
            }

            for (const connectionId of currentNode.connections) {
                if (connectionId !== parentId) {
                    queue.push({
                        nodeId: connectionId,
                        stepsRemaining: stepsRemaining - 1,
                        parentId: nodeId
                    });
                }
            }
        }

        return Array.from(possibleMoves);
    }
}
