'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SupabaseChatbotRepository } from '@/data/repositories/supabase-chatbot.repository';
import { ChatbotFlowEngine } from '@/data/services/chatbot-flow.engine';

interface Message {
    id: string;
    type: 'bot' | 'user';
    text: string;
    options?: string[];
    nodeId?: string;
}

export const SupportChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [flowEngine, setFlowEngine] = useState<ChatbotFlowEngine | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    // Load chatbot flow on mount
    useEffect(() => {
        loadChatbotFlow();
    }, []);

    const loadChatbotFlow = async () => {
        try {
            const repository = new SupabaseChatbotRepository();
            const flow = await repository.getActiveFlow();

            if (flow) {
                const engine = new ChatbotFlowEngine(flow);
                setFlowEngine(engine);

                // Set welcome message
                const welcomeMsg = engine.getWelcomeMessage();
                setMessages([welcomeMsg]);
            } else {
                // Fallback message if no flow is configured
                setMessages([
                    {
                        id: 'fallback',
                        type: 'bot',
                        text: 'Hi there! 👋 Welcome to Inner Loop Technologies. Please contact us for assistance.',
                        options: [],
                    },
                ]);
            }
        } catch (error) {
            console.error('Failed to load chatbot flow:', error);
            // Fallback message on error
            setMessages([
                {
                    id: 'error',
                    type: 'bot',
                    text: 'Hi there! 👋 Welcome to Inner Loop Technologies. How can I help you today?',
                    options: [],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = (option: string, currentNodeId?: string) => {
        if (!flowEngine || !currentNodeId) return;

        // Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: option,
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const botResponse = flowEngine.handleUserChoice(option, currentNodeId);

            if (botResponse) {
                setMessages((prev) => [...prev, botResponse]);

                // Execute action if it's an action node
                setTimeout(() => {
                    flowEngine.executeAction(botResponse.nodeId || '');
                }, 500);
            }

            setIsTyping(false);
        }, 800);
    };

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            <div
                className={cn(
                    'bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden transition-all duration-300 origin-bottom-right w-[350px] max-h-[500px] flex flex-col',
                    isOpen
                        ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto'
                        : 'scale-95 opacity-0 translate-y-4 pointer-events-none h-0'
                )}
            >
                {/* Header */}
                <div className="bg-[#128C7E] p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Customer Support</h3>
                            <p className="text-xs text-white/80 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleChat}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-[#128C7E]" />
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        'flex flex-col max-w-[85%]',
                                        msg.type === 'user' ? 'self-end items-end' : 'self-start items-start'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'px-4 py-2.5 rounded-2xl text-sm shadow-sm',
                                            msg.type === 'user'
                                                ? 'bg-[#128C7E] text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        )}
                                    >
                                        {msg.text}
                                    </div>

                                    {/* Options Chips */}
                                    {msg.options && msg.options.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {msg.options.map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleOptionClick(opt, msg.nodeId)}
                                                    className="text-xs font-medium bg-white border border-[#128C7E]/20 text-[#128C7E] px-3 py-1.5 rounded-full hover:bg-[#128C7E] hover:text-white transition-all active:scale-95 shadow-sm"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex self-start items-center gap-1 bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 w-16">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-white border-t border-gray-100 text-xs text-center text-gray-400">
                    Bot responses are automated.
                </div>
            </div>

            {/* Floating Toggle Button */}
            <button
                onClick={toggleChat}
                className={cn(
                    'w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-green-500/30 hover:bg-[#128C7E] transition-all duration-300 flex items-center justify-center active:scale-90 z-50',
                    isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                )}
            >
                <div className="absolute inset-0 rounded-full animate-ping bg-green-400/30"></div>
                <MessageCircle size={28} fill="currentColor" className="relative z-10" />
            </button>

            {/* Alternative close button when open */}
            {/* <button
                onClick={toggleChat}
                className={cn(
                    'w-14 h-14 rounded-full bg-gray-100 text-gray-600 shadow-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center active:scale-90 absolute',
                    isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                )}
            >
                <X size={24} />
            </button> */}
        </div>
    );
};
