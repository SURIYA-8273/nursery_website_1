import { ChatbotFlow, ChatbotNode, ChatbotEdge } from '@/domain/entities/chatbot.entity';

export interface FlowMessage {
    id: string;
    type: 'bot' | 'user';
    text: string;
    options?: string[];
    nodeId?: string;
}

export class ChatbotFlowEngine {
    private flow: ChatbotFlow;
    private currentNodeId: string;
    private nodeMap: Map<string, ChatbotNode>;
    private edgeMap: Map<string, ChatbotEdge[]>;

    constructor(flow: ChatbotFlow) {
        this.flow = flow;
        this.nodeMap = new Map(flow.nodes.map(node => [node.id, node]));

        // Group edges by source node
        this.edgeMap = new Map();
        flow.edges.forEach(edge => {
            const edges = this.edgeMap.get(edge.source) || [];
            edges.push(edge);
            this.edgeMap.set(edge.source, edges);
        });

        // Find start node
        const startNode = flow.nodes.find(n => n.type === 'startNode');
        if (!startNode) {
            throw new Error('No start node found in flow');
        }

        // Get first connected node from start
        const firstEdge = this.edgeMap.get(startNode.id)?.[0];
        this.currentNodeId = firstEdge?.target || startNode.id;
    }

    getWelcomeMessage(): FlowMessage {
        const currentNode = this.nodeMap.get(this.currentNodeId);
        if (!currentNode) {
            return {
                id: 'error',
                type: 'bot',
                text: 'Error loading chatbot',
            };
        }

        return {
            id: this.currentNodeId,
            type: 'bot',
            text: currentNode.data.text,
            options: currentNode.data.options?.map(opt => opt.label),
            nodeId: this.currentNodeId,
        };
    }

    handleUserChoice(optionLabel: string, currentNodeId: string): FlowMessage | null {
        const currentNode = this.nodeMap.get(currentNodeId);
        if (!currentNode) return null;

        // Find the option that was selected
        const selectedOption = currentNode.data.options?.find(
            opt => opt.label === optionLabel
        );

        if (!selectedOption) return null;

        // Find the edge connected to this option
        const edges = this.edgeMap.get(currentNodeId) || [];
        const targetEdge = edges.find(
            edge => edge.sourceHandle === selectedOption.id
        );

        if (!targetEdge) return null;

        // Get target node
        const targetNode = this.nodeMap.get(targetEdge.target);
        if (!targetNode) return null;

        this.currentNodeId = targetNode.id;

        // Handle action nodes
        if (targetNode.type === 'actionNode') {
            return this.handleActionNode(targetNode);
        }

        // Return message node
        return {
            id: targetNode.id,
            type: 'bot',
            text: targetNode.data.text,
            options: targetNode.data.options?.map(opt => opt.label),
            nodeId: targetNode.id,
        };
    }

    private handleActionNode(node: ChatbotNode): FlowMessage {
        const { actionType, actionValue, text } = node.data;

        switch (actionType) {
            case 'whatsapp':
                return {
                    id: node.id,
                    type: 'bot',
                    text: text || 'Opening WhatsApp...',
                    nodeId: node.id,
                };

            case 'url':
                return {
                    id: node.id,
                    type: 'bot',
                    text: text || 'Opening link...',
                    nodeId: node.id,
                };

            case 'end':
                return {
                    id: node.id,
                    type: 'bot',
                    text: text || 'Thank you for chatting with us! Have a great day! 🌿',
                    nodeId: node.id,
                };

            default:
                return {
                    id: node.id,
                    type: 'bot',
                    text: text || 'Action completed',
                    nodeId: node.id,
                };
        }
    }

    executeAction(nodeId: string): void {
        const node = this.nodeMap.get(nodeId);
        if (!node || node.type !== 'actionNode') return;

        const { actionType, actionValue } = node.data;

        switch (actionType) {
            case 'whatsapp':
                if (actionValue) {
                    const message = encodeURIComponent('Hello, I need help with plants 🌿');
                    window.open(`https://wa.me/${actionValue.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
                }
                break;

            case 'url':
                if (actionValue) {
                    window.open(actionValue, '_blank');
                }
                break;

            case 'end':
                // End conversation - no action needed
                break;
        }
    }

    getCurrentNodeId(): string {
        return this.currentNodeId;
    }

    reset(): void {
        const startNode = this.flow.nodes.find(n => n.type === 'startNode');
        if (startNode) {
            const firstEdge = this.edgeMap.get(startNode.id)?.[0];
            this.currentNodeId = firstEdge?.target || startNode.id;
        }
    }
}
