'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Check, RefreshCw } from 'lucide-react'; // Using icons
import { cn } from '@/lib/utils';
import { WhatsAppService } from '@/data/services/whatsapp.service';

interface Message {
    id: string;
    type: 'bot' | 'user';
    text: string;
    options?: string[];
}

export const SupportChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            type: 'bot',
            text: 'Hi there! 👋 Welcome to Inner Loop Technologies. How can I help you today?',
            options: ['Browse Plants',
                        'Track Order',
                        'Plant Care Tips',
                        'Offers & Discounts',
                        'Chat on WhatsApp']
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleOptionClick = (option: string) => {
        // Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: option
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // Simulate Bot Response
        setTimeout(() => {
            let botText = '';
            let botOptions: string[] | undefined = undefined;

            switch (option) {
                // ===== MAIN MENU =====
                case 'Back to Menu':
                    botText = 'What else can I help you with? 😊';
                    botOptions = [
                        'Browse Plants',
                        'Track Order',
                        'Plant Care Tips',
                        'Offers & Discounts',
                        'Chat on WhatsApp'
                    ];
                    break;

                // ===== SALES FLOW =====
                case 'Browse Plants':
                    botText = 'Great choice! 🌿 What type of plants are you looking for?';
                    botOptions = [
                        'Indoor Plants',
                        'Outdoor Plants',
                        'Flowering Plants',
                        'Best Sellers',
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                case 'Indoor Plants':
                    botText = 'Indoor plants are perfect for homes & offices! Want me to open our indoor collection?';
                    botOptions = [
                        'Open Indoor Collection',
                        'Recommend a Plant',
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                case 'Outdoor Plants':
                    botText = 'Outdoor plants add life to gardens & balconies 🌳';
                    botOptions = [
                        'Open Outdoor Collection',
                        'Recommend a Plant',
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                case 'Flowering Plants':
                    botText = 'Flowering plants bring color & happiness 🌸';
                    botOptions = [
                        'Open Flower Collection',
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                case 'Best Sellers':
                    botText = 'These are our customer favorites ⭐ Want to see them?';
                    botOptions = [
                        'View Best Sellers',
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                // ===== RECOMMENDATION FLOW =====
                case 'Recommend a Plant':
                    botText = 'Tell me your space — where will you keep the plant?';
                    botOptions = [
                        'Home',
                        'Office',
                        'Balcony',
                        'Garden',
                        'Back to Menu'
                    ];
                    break;

                case 'Home':
                    botText = 'For homes: Snake Plant & Peace Lily are easy to maintain 🌱';
                    botOptions = [
                        'Chat on WhatsApp',
                        'Browse Plants',
                        'Back to Menu'
                    ];
                    break;

                case 'Office':
                    botText = 'For office desks: ZZ Plant & Lucky Bamboo are perfect ✨';
                    botOptions = [
                        'Chat on WhatsApp',
                        'Browse Plants',
                        'Back to Menu'
                    ];
                    break;

                case 'Balcony':
                    botText = 'Balconies love sunlight! Try Hibiscus or Bougainvillea 🌺';
                    botOptions = [
                        'Chat on WhatsApp',
                        'Browse Plants',
                        'Back to Menu'
                    ];
                    break;

                case 'Garden':
                    botText = 'Gardens look amazing with flowering shrubs & trees 🌳';
                    botOptions = [
                        'Chat on WhatsApp',
                        'Browse Plants',
                        'Back to Menu'
                    ];
                    break;

                // ===== OFFERS =====
                case 'Offers & Discounts':
                    botText = '🔥 We currently have special nursery discounts! Want details?';
                    botOptions = [
                        'View Offers',
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                case 'View Offers':
                    botText = 'Opening latest offers page… 🎉';
                    window.open('/offers', '_blank'); // change link
                    botOptions = ['Back to Menu'];
                    break;

                // ===== ORDER SUPPORT =====
                case 'Track Order':
                    botText = 'Please share your order ID on WhatsApp and we’ll track it instantly 📦';
                    botOptions = [
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                case 'Delivery Time':
                    botText = 'Delivery takes 2–5 business days depending on location 🚚';
                    botOptions = [
                        'Track Order',
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                case 'Cancel Order':
                    botText = 'We can help cancel quickly. Please contact support with your order ID.';
                    botOptions = [
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                case 'Return Policy':
                    botText = 'If a plant arrives damaged, we offer replacement support 🌿';
                    botOptions = [
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                // ===== PLANT CARE =====
                case 'Plant Care Tips':
                    botText = 'Happy plants = happy home 🌱 What do you want to know?';
                    botOptions = [
                        'How to Water Plants',
                        'Sunlight Guide',
                        'Beginner Tips',
                        'Back to Menu'
                    ];
                    break;

                case 'How to Water Plants':
                    botText = 'Water only when the top soil is dry. Overwatering kills more plants than underwatering 😄';
                    botOptions = ['Back to Menu'];
                    break;

                case 'Sunlight Guide':
                    botText = 'Most indoor plants prefer bright indirect light ☀️ Avoid harsh direct sun.';
                    botOptions = ['Back to Menu'];
                    break;

                case 'Beginner Tips':
                    botText = 'Start with Snake Plant, ZZ Plant, or Money Plant. They are beginner friendly 🌿';
                    botOptions = [
                        'Recommend a Plant',
                        'Back to Menu'
                    ];
                    break;

                // ===== TRUST BUILDING =====
                case 'Why Buy From Us':
                    botText = '✔ Healthy plants\n✔ Safe packaging\n✔ Fast delivery\n✔ Support after purchase';
                    botOptions = [
                        'Browse Plants',
                        'Chat on WhatsApp',
                        'Back to Menu'
                    ];
                    break;

                // ===== WHATSAPP =====
                case 'Chat on WhatsApp':
                    botText = 'Connecting you to our plant expert on WhatsApp… 💬';
                    window.open(
                        WhatsAppService.generateSupportLink('Hello, I need help with plants 🌿'),
                        '_blank'
                    );
                    break;

                // ===== DEFAULT =====
                default:
                    botText = "I didn't understand that. Want to talk to a human?";
                    botOptions = ['Chat on WhatsApp', 'Back to Menu'];
            }


            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                text: botText,
                options: botOptions
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000);
    };

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            <div
                className={cn(
                    "bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden transition-all duration-300 origin-bottom-right w-[350px] max-h-[500px] flex flex-col",
                    isOpen ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" : "scale-95 opacity-0 translate-y-4 pointer-events-none h-0"
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
                    <button onClick={toggleChat} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px]">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex flex-col max-w-[85%]",
                                msg.type === 'user' ? "self-end items-end" : "self-start items-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                                    msg.type === 'user'
                                        ? "bg-[#128C7E] text-white rounded-br-none"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                )}
                            >
                                {msg.text}
                            </div>

                            {/* Options Chips */}
                            {msg.options && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {msg.options.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleOptionClick(opt)}
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
                </div>

                {/* Footer (Input placeholder - mostly generic for now as we drive via options) */}
                <div className="p-3 bg-white border-t border-gray-100 text-xs text-center text-gray-400">
                    Bot responses are automated.
                </div>
            </div>

            {/* Floating Toggle Button */}
            <button
                onClick={toggleChat}
                className={cn(
                    "w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-green-500/30 hover:bg-[#128C7E] transition-all duration-300 flex items-center justify-center active:scale-90 z-50",
                    isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                )}
            >
                <div className="absolute inset-0 rounded-full animate-ping bg-green-400/30"></div>
                <MessageCircle size={28} fill="currentColor" className="relative z-10" />
            </button>

            {/* Alternative close button when open (optional, but X in header covers it usually) */}
            {/* Note: I'm hiding the main button when open to avoid clutter, relying on header X to close. 
                 But often a floating X is nice. Let's stick to header X for now as per design pattern. */}

            {/* Re-show button if closed is handled by the conditional class above */}

            <button
                onClick={toggleChat}
                className={cn(
                    "w-14 h-14 rounded-full bg-gray-100 text-gray-600 shadow-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center active:scale-90 absolute",
                    isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                )}
            >
                <X size={24} />
            </button>

        </div>
    );
};
