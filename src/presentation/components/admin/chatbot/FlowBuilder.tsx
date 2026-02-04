'use client';

import { useCallback, useState, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    Node,
    NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { MessageNode } from './nodes/MessageNode';
import { StartNode } from './nodes/StartNode';
import { ActionNode } from './nodes/ActionNode';
import { FlowSidebar } from './FlowSidebar';
import { NodeEditor } from './NodeEditor';
import { ChatbotNodeData, NodeActionType } from '@/domain/entities/chatbot.entity';
import { Save, Download, Upload, Loader2, Menu, X } from 'lucide-react';
import { SupabaseChatbotRepository } from '@/data/repositories/supabase-chatbot.repository';
import { toast } from 'react-toastify';

const nodeTypes = {
    startNode: StartNode,
    messageNode: MessageNode,
    actionNode: ActionNode,
} as any;

const initialNodes: Node<ChatbotNodeData>[] = [
    {
        id: 'start-1',
        type: 'startNode',
        position: { x: 100, y: 200 },
        data: {
            label: 'Start',
            text: 'Conversation Start',
            options: [],
        },
    },
];

export const FlowBuilder = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node<ChatbotNodeData> | null>(null);
    const [flowName, setFlowName] = useState('Untitled Flow');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const repository = new SupabaseChatbotRepository();

    // Load active flow on mount
    useEffect(() => {
        loadActiveFlow();
    }, []);

    const loadActiveFlow = async () => {
        try {
            const flow = await repository.getActiveFlow();
            if (flow) {
                setFlowName(flow.name);
                setCurrentFlowId(flow.id);
                setNodes(flow.nodes.length > 0 ? flow.nodes as any : initialNodes);
                setEdges(flow.edges as any);
            }
        } catch (error) {
            console.error('Failed to load flow:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onConnect = useCallback(
        (connection: Connection) => {
            // Find the source node to get option label
            const sourceNode = nodes.find((n) => n.id === connection.source);
            const sourceHandle = connection.sourceHandle;

            let edgeLabel = '';
            if (sourceNode && sourceHandle) {
                const option = sourceNode.data.options?.find((opt: any) => opt.id === sourceHandle);
                if (option) {
                    edgeLabel = option.label;
                }
            }

            const newEdge: Edge = {
                ...connection,
                id: `edge-${Date.now()}`,
                label: edgeLabel,
                type: 'smoothstep',
                animated: true,
            } as Edge;

            setEdges((eds) => addEdge(newEdge, eds) as any);
        },
        [nodes, setEdges]
    );

    const handleAddNode = (type: 'messageNode' | 'actionNode', actionType?: NodeActionType) => {
        const newNode: Node<ChatbotNodeData> = {
            id: `node-${Date.now()}`,
            type,
            position: { x: Math.random() * 400 + 200, y: Math.random() * 400 + 100 },
            data: {
                label: type === 'messageNode' ? 'New Message' : `New ${actionType || 'Action'}`,
                text: type === 'messageNode' ? 'Enter your message here...' : '',
                options: [],
                actionType: type === 'actionNode' ? actionType : undefined,
                actionValue: '',
            },
        };

        setNodes((nds) => [...nds, newNode]);
        // Close sidebar on mobile after adding node
        setIsSidebarOpen(false);
    };

    const handleNodeClick = (_event: React.MouseEvent, node: Node<ChatbotNodeData>) => {
        if (node.type !== 'startNode') {
            setSelectedNode(node);
        }
    };

    const handleSaveNode = (nodeId: string, data: ChatbotNodeData) => {
        setNodes((nds) =>
            nds.map((node) => (node.id === nodeId ? { ...node, data } : node))
        );
    };

    const handleDeleteNode = (nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge: any) => edge.source !== nodeId && edge.target !== nodeId));
    };

    const handleSaveFlow = async () => {
        setIsSaving(true);
        try {
            if (currentFlowId) {
                await repository.updateFlow(currentFlowId, {
                    name: flowName,
                    nodes: nodes as any,
                    edges,
                });
                toast.success('Flow updated successfully!');
            } else {
                const newFlow = await repository.saveFlow({
                    name: flowName,
                    nodes: nodes as any,
                    edges,
                    isActive: true,
                });
                setCurrentFlowId(newFlow.id);
                toast.success('Flow saved successfully!');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save flow');
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportFlow = () => {
        const flowData = {
            name: flowName,
            nodes,
            edges,
        };
        const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${flowName.replace(/\s+/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Flow exported!');
    };

    const handleImportFlow = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const flowData = JSON.parse(e.target?.result as string);
                setFlowName(flowData.name || 'Imported Flow');
                setNodes(flowData.nodes || []);
                setEdges(flowData.edges || []);
                toast.success('Flow imported successfully!');
            } catch (error) {
                toast.error('Invalid flow file');
            }
        };
        reader.readAsText(file);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className={`
                fixed md:relative z-50 h-full
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <FlowSidebar onAddNode={handleAddNode} />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <input
                            type="text"
                            value={flowName}
                            onChange={(e) => setFlowName(e.target.value)}
                            className="text-sm md:text-lg font-bold border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-32 md:w-auto"
                        />
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        <label className="cursor-pointer px-2 md:px-3 py-2 text-xs md:text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1 md:gap-2">
                            <Upload size={16} className="hidden md:block" />
                            <span className="hidden sm:inline">Import</span>
                            <Upload size={14} className="md:hidden" />
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportFlow}
                                className="hidden"
                            />
                        </label>

                        <button
                            onClick={handleExportFlow}
                            className="px-2 md:px-3 py-2 text-xs md:text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1 md:gap-2"
                        >
                            <Download size={16} className="hidden md:block" />
                            <Download size={14} className="md:hidden" />
                            <span className="hidden sm:inline">Export</span>
                        </button>

                        <button
                            onClick={handleSaveFlow}
                            disabled={isSaving}
                            className="px-2 md:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="hidden sm:inline">Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    <span className="hidden sm:inline">Save Flow</span>
                                    <span className="sm:hidden">Save</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* React Flow Canvas */}
                <div className="flex-1">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={handleNodeClick}
                        nodeTypes={nodeTypes}
                        fitView
                        attributionPosition="bottom-left"
                    >
                        <Background />
                        <Controls />
                        <MiniMap
                            nodeColor={(node) => {
                                if (node.type === 'startNode') return '#10b981';
                                if (node.type === 'actionNode') return '#8b5cf6';
                                return '#3b82f6';
                            }}
                        />
                    </ReactFlow>
                </div>
            </div>

            {/* Properties Panel */}
            <NodeEditor
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onSave={handleSaveNode}
                onDelete={handleDeleteNode}
            />
        </div>
    );
};
