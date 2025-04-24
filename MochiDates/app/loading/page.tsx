'use client';

import React, { useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Header from '@/components/ui/Header';
import ChatBubble from '@/components/chat/ChatBubble';

function LoadingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const conversationId = searchParams.get('cid') as Id<"conversations"> | null;

    const conversationData = useQuery(
        api.conversations.getConversation,
        conversationId ? { conversationId } : 'skip'
    );

    useEffect(() => {
        if (!conversationId) {
            console.error("Loading page: No conversation ID found in URL.");
            router.replace('/');
            return;
        }

        if (conversationData) {
            if (conversationData.status === 'completed') {
                router.replace(`/results/${conversationId}`);
            } else if (conversationData.status === 'error') {
                console.error("Error processing conversation:", conversationId);
                 router.replace(`/results/${conversationId}?error=true`);
            }
        }
    }, [conversationData, router, conversationId]);

    return (
        <div className="flex flex-col items-center justify-center flex-grow text-center p-4">
            <div className="chat chat-start mb-4">
                <ChatBubble sender="mochi" message='Okay okay... crunching love data 💖 Give me a sec...' />
            </div>
            <Image
                src="/mochi.png"
                alt="Mochi"
                width={200}
                height={200}
                className="animate-bounce"
            />
        </div>
    );
}


export default function LoadingPage() {
    return (
         <div className="flex flex-col h-screen">
            <Header />
            <Suspense fallback={<div className="flex-grow flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>}>
                <LoadingContent />
            </Suspense>
        </div>
    );
}