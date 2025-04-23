interface ChatBubbleProps {
    sender: 'mochi' | 'user';
    message: string
}

export default function ChatBubble({ sender, message }: ChatBubbleProps) {
    const isUser = sender === 'user';

    return (
        <div className={`chat ${isUser ? 'chat-end' : 'chat-start'}`}>
            <div className={`chat-bubble ${isUser ? 'chat-bubble-secondary' : 'chat-bubble-primary'} text-background text-lg font-semibold max-w-xl`}>
                {message}
            </div>
        </div>
    );
}