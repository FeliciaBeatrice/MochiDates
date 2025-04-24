'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInputArea from '@/components/chat/ChatInputArea';
import Image from 'next/image';
import { prompts } from '@/data/prompts';
import { Prompt, Message } from '@/types';

import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";


export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [isMochiTyping, setIsMochiTyping] = useState<boolean>(false);

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const userAnswers = useRef<Record<string, string>>({});

  const router = useRouter();

  const startConversation = useMutation(api.conversations.startConversation);
  const generateDateIdeas = useAction(api.conversations.generateDateIdeas);

  const currentPrompt: Prompt | null = prompts[currentPromptIndex] || null;

  useEffect(() => {
    const initializeConversation = async () => {
      console.log("Initializing conversation...");
      try {
        const newConversationId = await startConversation();
        setConversationId(newConversationId);
        console.log("Conversation started with ID:", newConversationId);
        if (prompts.length > 0 && messages.length === 0) {
          setMessages([{ id: `mochi-${prompts[0].id}`, sender: 'mochi', message: prompts[0].message }]);
        }
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
    };
    initializeConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startConversation]);


  const handleUserResponse = (userMessage: string) => {
    if (!currentPrompt || !conversationId || isMochiTyping) return;

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: userMessage,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    userAnswers.current[String(currentPrompt.id)] = userMessage;

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
      }, 500); // Mochi thinking delay
    } else {
      setIsMochiTyping(true);

      generateDateIdeas({
        conversationId: conversationId,
        answers: userAnswers.current,
      })
        .then(() => {
          // --- Navigate to the Loading Page ---
          router.push(`/loading?cid=${conversationId}`);
        })
        .catch(error => {
          console.error("Error calling generateDateIdeas action:", error);
          setIsMochiTyping(false);
          alert("There was an error starting the date idea generation. Please try again.");
        });
    }
  };


  return (
    <div className="flex flex-col h-screen text-base-content">
      <Header />
      <div className="flex-grow flex flex-row overflow-hidden">
        <div className="hidden md:flex flex-shrink-0 w-48 items-end overflow-hidden">
          {/* Mochi Image */}
          <Image
            src="/mochi.png"
            alt="Mochi"
            width={250}
            height={250}
            className="translate-y-10"
          />
        </div>
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
            isConversationEnd={false}
          />
        </div>
      </div>
    </div>
  );
}