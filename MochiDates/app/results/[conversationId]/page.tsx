'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Header from '@/components/ui/Header';
import Image from 'next/image';
import DateIdeaCard from '@/components/ui/DateIdeaCard';
import Button from '@/components/ui/Button';

interface DateIdea {
    title: string;
    description: string;
    imageUrl?: string;
}


function ResultsContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const conversationId = params.conversationId as Id<"conversations"> | undefined;
    const hasError = searchParams.get('error') === 'true';

    const conversationData = useQuery(
        api.conversations.getConversation,
        conversationId ? { conversationId } : 'skip'
    );

    const handleGenerateMore = () => {
        // TODO: Implement "Generate More" functionality
        // Call a new Convex action to get more ideas for the *same* conversationId?
        console.log("Generate More clicked for conversation:", conversationId);
    };

    // --- Loading State ---
    if (conversationData === undefined && !hasError && conversationId) {
        return (
            <div className="text-center p-4 flex flex-col items-center">
                <span className="loading loading-lg loading-spinner mb-4"></span>
                <p>Mochi is fetching your date ideas...</p>
            </div>
        );
    }

    if (!conversationId) {
        return <div className="text-center p-4 text-error">Invalid results link. Conversation ID missing.</div>;
    }
    if (hasError) {
        return (
            <div className="text-center p-4 max-w-md mx-auto">
                <Image
                    src="/mochi.png"
                    alt="Mochi"
                    width={150}
                    height={150}
                    className="mx-auto mb-4 opacity-70"
                />
                <h2 className="text-xl font-bold mb-2 text-error">Oh no!</h2>
                <p className="mb-4">Mochi had a little trouble processing your request. Please try starting a new chat.</p>
                <Button text="Start Over" onClick={() => router.push('/')} />
            </div>
        )
    }
    if (conversationData === null) {
        return <div className="text-center p-4 text-error">Could not find results for this conversation. Maybe it expired?</div>;
    }


    // --- Results Display ---
    const ideas = conversationData?.dateIdeas;
    const displayedIdeas = ideas?.slice(0, 3) || [];

    return (
        <div className="flex flex-col items-center w-full p-4 md:p-8">
            {/* Cards Section */}
            {displayedIdeas && displayedIdeas.length > 0 ? (
                <div className="flex justify-center gap-6 md:gap-8 mb-8 w-full max-w-5xl">
                    {displayedIdeas.map((idea, index) => (
                        (typeof idea === 'object' && idea !== null && typeof idea.title === 'string' && typeof idea.description === 'string')
                            ? <div key={index} className="flex-none"><DateIdeaCard idea={idea as DateIdea} /></div>
                            : <div key={index} className="text-warning p-4 border border-warning rounded-lg flex-none">Received an invalid idea format.</div>
                    ))}
                </div>
            ) : (
                // --- Empty State ---
                <div className="text-center p-4 max-w-md mx-auto">
                    <Image
                        src="/mochi.png"
                        alt="Mochi"
                        width={150}
                        height={150}
                        className="mx-auto mb-4 opacity-70"
                    />
                    <h2 className="text-xl font-bold mb-2">Hmm...</h2>
                    <p className="mb-4">Mochi couldn't generate specific ideas this time. Maybe try adjusting your preferences in a new chat?</p>
                    <Button text="Start Over" onClick={() => router.push('/')} />
                </div>
            )}

            {/* "Generate More" Button */}
            {ideas && ideas.length > 0 && (
                <Button text='Generate More!' onClick={handleGenerateMore} />
            )}
        </div>
    );
}


export default function ResultsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex flex-col items-center py-8 bg-foreground">
                <Suspense fallback={
                    <div className="flex-grow flex flex-col items-center justify-center">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                }>
                    <ResultsContent />
                </Suspense>
            </main>
        </div>
    );
}