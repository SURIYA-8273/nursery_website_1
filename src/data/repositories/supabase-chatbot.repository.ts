import { supabase } from '../datasources/supabase.client';
import { IChatbotRepository } from '@/domain/repositories/chatbot.repository';
import { ChatbotFlow } from '@/domain/entities/chatbot.entity';

export class SupabaseChatbotRepository implements IChatbotRepository {
    private tableName = 'chatbot_flows';

    async getActiveFlow(): Promise<ChatbotFlow | null> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('is_active', true)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async getFlowById(id: string): Promise<ChatbotFlow | null> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async getAllFlows(): Promise<ChatbotFlow[]> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data) return [];
        return data.map(this.mapToEntity);
    }

    async saveFlow(flow: Partial<ChatbotFlow>): Promise<ChatbotFlow> {
        const { data, error } = await supabase
            .from(this.tableName)
            .insert({
                name: flow.name || 'Untitled Flow',
                nodes: flow.nodes || [],
                edges: flow.edges || [],
                is_active: flow.isActive || false,
            })
            .select()
            .single();

        if (error) throw error;
        return this.mapToEntity(data);
    }

    async updateFlow(id: string, flow: Partial<ChatbotFlow>): Promise<ChatbotFlow> {
        const updateData: any = {
            updated_at: new Date().toISOString(),
        };

        if (flow.name !== undefined) updateData.name = flow.name;
        if (flow.nodes !== undefined) updateData.nodes = flow.nodes;
        if (flow.edges !== undefined) updateData.edges = flow.edges;
        if (flow.isActive !== undefined) updateData.is_active = flow.isActive;

        const { data, error } = await supabase
            .from(this.tableName)
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return this.mapToEntity(data);
    }

    async deleteFlow(id: string): Promise<void> {
        const { error } = await supabase
            .from(this.tableName)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async setActiveFlow(id: string): Promise<void> {
        // First, deactivate all flows
        await supabase
            .from(this.tableName)
            .update({ is_active: false })
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

        // Then activate the selected one
        const { error } = await supabase
            .from(this.tableName)
            .update({ is_active: true })
            .eq('id', id);

        if (error) throw error;
    }

    private mapToEntity(data: any): ChatbotFlow {
        return {
            id: data.id,
            name: data.name,
            nodes: data.nodes || [],
            edges: data.edges || [],
            isActive: data.is_active || false,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };
    }
}
