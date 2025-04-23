// components/ChatInputArea.tsx
import React, { KeyboardEvent } from 'react';
import TextInput from './TextInput';
import ButtonOptions from './ButtonOptions';
import { Prompt } from '@/types';

interface ChatInputAreaProps {
    currentPrompt: Prompt | null;
    inputValue: string;
    setInputValue: (value: string) => void;
    handleUserResponse: (response: string) => void;
    isMochiTyping: boolean;
    isConversationEnd: boolean;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
    currentPrompt,
    inputValue,
    setInputValue,
    handleUserResponse,
    isMochiTyping,
    isConversationEnd,
}) => {

    const handleTextInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim() && currentPrompt?.inputMode === 'text' && !isConversationEnd) {
            handleUserResponse(inputValue.trim());
        }
    };

    const handleTextSubmit = () => {
        if (inputValue.trim() && currentPrompt?.inputMode === 'text' && !isConversationEnd) {
            handleUserResponse(inputValue.trim());
        }
    }

    const handleButtonClick = (option: string) => {
        if (currentPrompt?.inputMode === 'buttons' && !isConversationEnd) {
            handleUserResponse(option);
        }
    };

    const isDisabled = isMochiTyping || isConversationEnd;

    return (
        <div className="p-4 border-t border-base-300 bg-background z-20 min-h-[80px] flex items-center"> {/* Ensure vertical centering */}
            <div className="w-full">
                {!isConversationEnd && currentPrompt ? (
                    <>
                        {currentPrompt.inputMode === 'text' && (
                            <TextInput
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleTextInputKeyDown}
                                onSubmit={handleTextSubmit}
                                disabled={isDisabled}
                                placeholder={isMochiTyping ? "Mochi is typing..." : "Start Typing ..."}
                            />
                        )}

                        {currentPrompt.inputMode === 'buttons' && currentPrompt.options && (
                            <ButtonOptions
                                options={currentPrompt.options}
                                onOptionClick={handleButtonClick}
                                disabled={isDisabled}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center text-base-content opacity-60 h-full flex items-center justify-center">
                        {isConversationEnd ? "Mochi is thinking..." : "Loading chat..."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInputArea;