'use client';

import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import Header from '@/components/ui/Header';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInputArea from '@/components/chat/ChatInputArea';
import Image from 'next/image';
import { prompts } from '@/data/prompts';
import { Prompt, Message } from '@/types';

import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface DateIdea {
  title: string;
  description: string;
}

const DateIdeaCard: React.FC<{ idea: DateIdea }> = ({ idea }) => (
  <div className="card bg-base-200 shadow-xl m-2">
    <div className="card-body">
      <h2 className="card-title">{idea.title}</h2>
      <p>{idea.description}</p>
    </div>
  </div>
);


export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [isMochiTyping, setIsMochiTyping] = useState<boolean>(false);
  const [isConversationEnd, setIsConversationEnd] = useState<boolean>(false);

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const userAnswers = useRef<Record<string, string>>({});

  const startConversation = useMutation(api.conversations.startConversation);
  const generateDateIdeas = useAction(api.conversations.generateDateIdeas);

  const conversationData = useQuery(
    api.conversations.getConversation,
    conversationId ? { conversationId } : "skip"
  );

  const currentPrompt: Prompt | null = prompts[currentPromptIndex] || null;

  // --- Effect to start conversation on mount ---
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
    if (!currentPrompt || !conversationId) return;

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: userMessage,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    userAnswers.current[currentPrompt.id] = userMessage;


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
      }, 1000); // Mochi thinking delay
    } else {
      // --- End of predefined prompts ---
      setIsMochiTyping(false);
      setIsConversationEnd(true);
      const finalMochiMessage: Message = {
        id: `mochi-final-${Date.now()}`,
        sender: 'mochi',
        message: "Okay, got it! Let me think of some date ideas for you...",
      };
      setMessages((prevMessages) => [...prevMessages, finalMochiMessage]);

      // --- Trigger the backend action ---
      generateDateIdeas({ conversationId: conversationId, answers: userAnswers.current })
        .then(() => console.log("generateDateIdeas action called successfully."))
        .catch(error => console.error("Error calling generateDateIdeas action:", error));
    }
  };

  // --- Render Loading/Results based on Convex query data ---
  const renderResults = () => {
    if (!isConversationEnd) return null;

    const status = conversationData?.status;
    const ideas = conversationData?.dateIdeas;

    if (status === "processing") {
      return <div className="p-4 text-center">Mochi is thinking... <span className="loading loading-dots loading-sm"></span></div>;
    }

    if (status === "error") {
      return <div className="p-4 text-center text-error">Oops! Mochi had trouble thinking of ideas. Please try again later.</div>;
    }

    if (status === "completed" && ideas && ideas.length > 0) {
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold text-center mb-4">Here are some date ideas!</h2>
          <div className="flex flex-wrap justify-center">
            {ideas.map((idea: any, index: any) => (
              <DateIdeaCard key={index} idea={idea} />
            ))}
          </div>
        </div>
      );
    }

    if (status === "completed" && (!ideas || ideas.length === 0)) {
      return <div className="p-4 text-center">Mochi couldn't come up with specific ideas based on your answers. Maybe try being more descriptive?</div>;
    }

    return null;
  };


  return (
    <div className="flex flex-col h-screen text-base-content">
      <Header />

      <div className="flex-grow flex flex-row overflow-hidden">
        {/* 1. Mochi Image */}
        <div className="hidden md:flex flex-shrink-0 w-48 items-end overflow-hidden">
          <Image
            src="/mochi.png"
            alt="Mochi"
            width={250}
            height={250}
            className="translate-y-10"
          />
        </div>

        {/* 2. Chat Area */}
        <div className="flex flex-col flex-grow h-full overflow-hidden">
          <ChatMessages
            messages={messages}
            isMochiTyping={isMochiTyping && !isConversationEnd}
          />
          {isConversationEnd ? (
            renderResults()
          ) : (
            <ChatInputArea
              currentPrompt={currentPrompt}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleUserResponse={handleUserResponse}
              isMochiTyping={isMochiTyping}
              isConversationEnd={isConversationEnd}
            />
          )}
        </div>
      </div>
    </div>
  );
}