'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ExternalLink, MessageCircle, XCircle } from 'lucide-react';
import { ChatbotNodeData } from '@/domain/entities/chatbot.entity';

export const ActionNode = memo(({ data, selected }: any) => {
    const getIcon = () => {
        switch (data.actionType) {
            case 'whatsapp':
                return <MessageCircle size={20} />;
            case 'url':
                return <ExternalLink size={20} />;
            case 'end':
                return <XCircle size={20} />;
            default:
                return <ExternalLink size={20} />;
        }
    };

    const getColor = () => {
        switch (data.actionType) {
            case 'whatsapp':
                return 'from-green-500 to-green-600';
            case 'url':
                return 'from-purple-500 to-purple-600';
            case 'end':
                return 'from-red-500 to-red-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div
            className={`
                bg-gradient-to-r ${getColor()} text-white
                rounded-lg shadow-md border-2 min-w-[200px]
                ${selected ? 'border-white' : 'border-transparent'}
                hover:shadow-lg transition-all
            `}
        >
            <div className="px-4 py-3 flex items-center gap-3">
                {getIcon()}
                <div className="flex-1">
                    <p className="font-medium text-sm">{data.label}</p>
                    {data.actionValue && (
                        <p className="text-xs opacity-90 truncate">{data.actionValue}</p>
                    )}
                </div>
            </div>

            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-white"
            />
        </div>
    );
});

ActionNode.displayName = 'ActionNode';
