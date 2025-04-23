'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInputArea from '@/components/chat/ChatInputArea';
import Image from 'next/image';
import { prompts } from '@/data/prompts';
import { Prompt, Message } from '@/types';

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [isMochiTyping, setIsMochiTyping] = useState<boolean>(false);
  const [isConversationEnd, setIsConversationEnd] = useState<boolean>(false);

  const currentPrompt: Prompt | null = prompts[currentPromptIndex] || null;

  useEffect(() => {
    if (currentPromptIndex === 0 && messages.length === 0 && currentPrompt) {
      setMessages([{ id: `mochi-${currentPrompt.id}`, sender: 'mochi', message: currentPrompt.message }]);
    }
  }, [currentPromptIndex, messages.length, currentPrompt]);

  const handleUserResponse = (userMessage: string) => {
    if (!currentPrompt) return;

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: userMessage,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    if (currentPrompt.inputMode === 'text') {
      setInputValue('');
    }

    const nextIndex = currentPromptIndex + 1;
    if (nextIndex < prompts.length) {
      const nextPrompt = prompts[nextIndex];
      setIsMochiTyping(true);
      setTimeout(() => {
        const newMochiMessage: Message = {
          id: `mochi-${nextPrompt.id}`,
          sender: 'mochi',
          message: nextPrompt.message,
        };
        setMessages((prevMessages) => [...prevMessages, newMochiMessage]);
        setCurrentPromptIndex(nextIndex);
        setIsMochiTyping(false);
      }, 1000);
    } else {
      setIsMochiTyping(false);
      setIsConversationEnd(true);
    }
  };

  return (
    <div className="flex flex-col h-screen text-base-content">
      <Header />

      <div className="flex-grow flex flex-row overflow-hidden">

        {/* 1. Mochi Image Container (Left Column) */}
        <div className="hidden md:flex flex-shrink-0 w-40 p-4 items-end justify-center">
          <Image
            src="/mochi.png"
            alt="Mochi"
            width={120}
            height={120}
          />
        </div>

        {/* 2. Chat Area Container (Right Column) */}
        <div className="flex flex-col flex-grow h-full overflow-hidden">

          <ChatMessages
            messages={messages}
            isMochiTyping={isMochiTyping}
          />

          <ChatInputArea
            currentPrompt={currentPrompt}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleUserResponse={handleUserResponse}
            isMochiTyping={isMochiTyping}
            isConversationEnd={isConversationEnd}
          />
        </div>

      </div>
    </div>
  );
}