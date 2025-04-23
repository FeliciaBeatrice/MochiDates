// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header'; // Assuming Header is styled appropriately
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
      }, 1000); // Simulate thinking time
    } else {
      setIsMochiTyping(false);
      setIsConversationEnd(true);
    }
  };

  // Define the approximate height of your input area for mascot positioning
  const inputAreaHeight = '80px'; // Adjust if your input area height differs

  return (
    // Use DaisyUI base colors for the main container
    <div className="flex flex-col h-screen bg-base-200 text-base-content">
      <Header /> {/* Ensure Header uses theme colors */}

      {/* Use a relative container for the main chat area to position mascot within it */}
      <div className="flex-grow relative overflow-hidden flex flex-col"> {/* Added overflow-hidden */}
        {/* Mascot Image Container */}
        <div
          className="absolute left-4 bottom-0 z-0 hidden md:block pointer-events-none"
          style={{ bottom: inputAreaHeight }} // Position above input area
        >
          <Image
            src="/mochi-bunny.png" // Ensure image exists in /public
            alt="Mochi Bunny Mascot"
            width={120}
            height={120}
            className="pixelated" // Apply pixelated style if defined in globals.css
          />
        </div>

        {/* ChatMessages now sits inside the relative container */}
        <ChatMessages messages={messages} isMochiTyping={isMochiTyping} />
      </div>


      {/* ChatInputArea remains at the bottom */}
      <ChatInputArea
        currentPrompt={currentPrompt}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleUserResponse={handleUserResponse}
        isMochiTyping={isMochiTyping}
        isConversationEnd={isConversationEnd}
      />
    </div>
  );
}