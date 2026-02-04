'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { ChatbotNodeData, ChatbotOption, NodeActionType } from '@/domain/entities/chatbot.entity';
import { Node } from '@xyflow/react';

interface NodeEditorProps {
    node: Node<ChatbotNodeData> | null;
    onClose: () => void;
    onSave: (nodeId: string, data: ChatbotNodeData) => void;
    onDelete: (nodeId: string) => void;
}

export const NodeEditor = ({ node, onClose, onSave, onDelete }: NodeEditorProps) => {
    const [editedData, setEditedData] = useState<ChatbotNodeData>(
        node?.data || {
            label: '',
            text: '',
            options: [],
        }
    );

    // Update editedData when node changes
    useEffect(() => {
        if (node?.data) {
            setEditedData(node.data);
        }
    }, [node]);

    if (!node) {
        return (
            <div className="hidden md:flex w-80 bg-gray-50 border-l border-gray-200 p-6 items-center justify-center">
                <p className="text-gray-400 text-sm">Select a node to edit</p>
            </div>
        );
    }

    const handleSave = () => {
        onSave(node.id, editedData);
        onClose();
    };

    const handleAddOption = () => {
        const newOption: ChatbotOption = {
            id: `opt-${Date.now()}`,
            label: 'New Option',
        };
        setEditedData({
            ...editedData,
            options: [...(editedData.options || []), newOption],
        });
    };

    const handleUpdateOption = (optionId: string, label: string) => {
        setEditedData({
            ...editedData,
            options: editedData.options?.map((opt) =>
                opt.id === optionId ? { ...opt, label } : opt
            ) || [],
        });
    };

    const handleDeleteOption = (optionId: string) => {
        setEditedData({
            ...editedData,
            options: editedData.options?.filter((opt) => opt.id !== optionId) || [],
        });
    };

    const isActionNode = node.type === 'actionNode';

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                onClick={onClose}
            />

            {/* Editor Panel - Modal on mobile, sidebar on desktop */}
            <div className="
                fixed md:relative
                bottom-0 md:bottom-auto
                left-0 right-0 md:left-auto md:right-auto
                w-full md:w-80
                max-h-[85vh] md:max-h-full
                bg-white 
                border-l border-gray-200 
                flex flex-col 
                h-auto md:h-full
                z-50
                rounded-t-2xl md:rounded-none
                shadow-2xl md:shadow-none
            ">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Edit Node</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Label */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Node Label
                        </label>
                        <input
                            type="text"
                            value={editedData.label}
                            onChange={(e) => setEditedData({ ...editedData, label: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Welcome Message"
                        />
                    </div>

                    {/* Message Text (for message nodes) */}
                    {!isActionNode && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message Text
                            </label>
                            <textarea
                                value={editedData.text}
                                onChange={(e) => setEditedData({ ...editedData, text: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter the bot's message..."
                            />
                        </div>
                    )}

                    {/* Action Type (for action nodes) */}
                    {isActionNode && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Action Type
                                </label>
                                <select
                                    value={editedData.actionType || 'url'}
                                    onChange={(e) =>
                                        setEditedData({
                                            ...editedData,
                                            actionType: e.target.value as NodeActionType,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="whatsapp">WhatsApp Redirect</option>
                                    <option value="url">URL Redirect</option>
                                    <option value="end">End Conversation</option>
                                </select>
                            </div>

                            {editedData.actionType !== 'end' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {editedData.actionType === 'whatsapp' ? 'Phone Number' : 'URL'}
                                    </label>
                                    <input
                                        type="text"
                                        value={editedData.actionValue || ''}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, actionValue: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={
                                            editedData.actionType === 'whatsapp'
                                                ? '+1234567890'
                                                : 'https://example.com'
                                        }
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Options (for message nodes) */}
                    {!isActionNode && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Button Options
                                </label>
                                <button
                                    onClick={handleAddOption}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <Plus size={14} />
                                    Add Option
                                </button>
                            </div>

                            <div className="space-y-2">
                                {editedData.options?.map((option: any) => (
                                    <div key={option.id} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={option.label}
                                            onChange={(e) =>
                                                handleUpdateOption(option.id, e.target.value)
                                            }
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Option label"
                                        />
                                        <button
                                            onClick={() => handleDeleteOption(option.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <Save size={16} />
                        Save Changes
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this node?')) {
                                onDelete(node.id);
                                onClose();
                            }
                        }}
                        className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <Trash2 size={16} />
                        Delete Node
                    </button>
                </div>
            </div>
        </>
    );
};
