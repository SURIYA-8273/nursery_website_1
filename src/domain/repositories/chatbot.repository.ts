import { ChatbotFlow } from '../entities/chatbot.entity';

export interface IChatbotRepository {
    getActiveFlow(): Promise<ChatbotFlow | null>;
    getFlowById(id: string): Promise<ChatbotFlow | null>;
    getAllFlows(): Promise<ChatbotFlow[]>;
    saveFlow(flow: Partial<ChatbotFlow>): Promise<ChatbotFlow>;
    updateFlow(id: string, flow: Partial<ChatbotFlow>): Promise<ChatbotFlow>;
    deleteFlow(id: string): Promise<void>;
    setActiveFlow(id: string): Promise<void>;
}
