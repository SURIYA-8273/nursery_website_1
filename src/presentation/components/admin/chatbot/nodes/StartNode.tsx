'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import { ChatbotNodeData } from '@/domain/entities/chatbot.entity';

export const StartNode = memo(({ data, selected }: any) => {
    return (
        <div
            className={`
                bg-gradient-to-br from-green-500 to-green-600 text-white
                rounded-full w-24 h-24 flex flex-col items-center justify-center
                shadow-lg border-4
                ${selected ? 'border-green-300' : 'border-white'}
            `}
        >
            <Play size={24} fill="white" />
            <span className="text-xs font-bold mt-1">START</span>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-green-300"
            />
        </div>
    );
});

StartNode.displayName = 'StartNode';
