import React, { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { Message } from '@/types';

interface ChatMessagesProps {
    messages: Message[];
    isMochiTyping: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isMochiTyping }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isMochiTyping]);

    return (
        // Use theme background color (or specify) and ensure padding
        <div className="flex-grow overflow-y-auto p-4 space-y-2 relative z-10 bg-base-200"> {/* Adjusted space, added bg */}
            {messages.map((msg) => (
                <ChatBubble key={msg.id} sender={msg.sender} message={msg.message} />
            ))}
            {isMochiTyping && (
                // Use ChatBubble for typing indicator for consistent styling
                <ChatBubble sender="mochi" message="..." />
            )}
            <div ref={chatEndRef} />
        </div>
    );
};

export default ChatMessages;