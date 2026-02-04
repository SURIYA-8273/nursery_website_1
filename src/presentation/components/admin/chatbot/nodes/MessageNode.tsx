'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { ChatbotNodeData } from '@/domain/entities/chatbot.entity';

export const MessageNode = memo(({ data, id, selected }: any) => {
    return (
        <div
            className={`
                bg-white rounded-lg shadow-md border-2 min-w-[250px] max-w-[300px]
                ${selected ? 'border-blue-500' : 'border-gray-200'}
                hover:shadow-lg transition-all
            `}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
                <MessageSquare size={16} />
                <span className="font-medium text-sm truncate">{data.label || 'Message'}</span>
            </div>

            {/* Body */}
            <div className="p-4">
                <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                    {data.text || 'Click to edit message...'}
                </p>

                {/* Options Preview */}
                {data.options && data.options.length > 0 && (
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-medium mb-1">Options:</p>
                        {data.options.map((option: any) => (
                            <div
                                key={option.id}
                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center justify-between"
                            >
                                <span className="truncate">{option.label}</span>
                                {/* Handle for each option */}
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={option.id}
                                    className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
                                    style={{ top: 'auto', right: -6 }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-gray-400"
            />
        </div>
    );
});

MessageNode.displayName = 'MessageNode';
