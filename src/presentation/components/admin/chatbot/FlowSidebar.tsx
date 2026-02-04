'use client';

import { MessageSquare, Play, ExternalLink, MessageCircle, XCircle } from 'lucide-react';

interface FlowSidebarProps {
    onAddNode: (type: 'messageNode' | 'actionNode', actionType?: 'whatsapp' | 'url' | 'end') => void;
}

export const FlowSidebar = ({ onAddNode }: FlowSidebarProps) => {
    const nodeTypes = [
        {
            type: 'messageNode' as const,
            label: 'Message',
            icon: MessageSquare,
            description: 'Bot message with options',
            color: 'bg-blue-500',
        },
        {
            type: 'actionNode' as const,
            actionType: 'whatsapp' as const,
            label: 'WhatsApp',
            icon: MessageCircle,
            description: 'Redirect to WhatsApp',
            color: 'bg-green-500',
        },
        {
            type: 'actionNode' as const,
            actionType: 'url' as const,
            label: 'URL Redirect',
            icon: ExternalLink,
            description: 'Open external link',
            color: 'bg-purple-500',
        },
        {
            type: 'actionNode' as const,
            actionType: 'end' as const,
            label: 'End Chat',
            icon: XCircle,
            description: 'End conversation',
            color: 'bg-red-500',
        },
    ];

    return (
        <div className="w-64 p-4 bg-white border-r border-gray-200 space-y-3">
            <div className="mb-4">
                <h3 className="font-bold text-gray-800 mb-1">Add Nodes</h3>
                <p className="text-xs text-gray-500">Click to add to canvas</p>
            </div>

            {nodeTypes.map((node) => {
                const Icon = node.icon;
                return (
                    <button
                        key={`${node.type}-${node.actionType || 'default'}`}
                        onClick={() => onAddNode(node.type, node.actionType)}
                        className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all text-left group"
                    >
                        <div className="flex items-start gap-3">
                            <div className={`${node.color} text-white p-2 rounded-md group-hover:scale-110 transition-transform`}>
                                <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-800">{node.label}</p>
                                <p className="text-xs text-gray-500 truncate">{node.description}</p>
                            </div>
                        </div>
                    </button>
                );
            })}

            <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 leading-relaxed">
                    💡 <strong>Tip:</strong> Connect message options to other nodes by dragging from the option handle.
                </p>
            </div>
        </div>
    );
};
