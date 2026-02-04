// Chatbot Flow Entities

export interface ChatbotOption {
    id: string;
    label: string;
    targetNodeId?: string;
}

export type NodeActionType = 'message' | 'whatsapp' | 'url' | 'end';

export interface ChatbotNodeData {
    label: string;
    text: string;
    options: ChatbotOption[];
    actionType?: NodeActionType;
    actionValue?: string; // URL or phone number for actions
    [key: string]: unknown; // Index signature for React Flow compatibility
}

export interface ChatbotNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: ChatbotNodeData;
}

export interface ChatbotEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    label?: string;
    data?: {
        optionId: string;
        optionLabel: string;
    };
}

export interface ChatbotFlow {
    id: string;
    name: string;
    nodes: ChatbotNode[];
    edges: ChatbotEdge[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
