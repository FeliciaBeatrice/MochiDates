import { v } from "convex/values";
import {
    query,
    mutation,
    action,
    internalMutation,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { GoogleGenAI } from "@google/genai";
import { backendPromptMap } from "./promptData";

// --- Use Gemini API Key ---
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    console.warn("GEMINI_API_KEY environment variable not set!");
}

// --- Initialize Gemini Client ---
const genAI = new GoogleGenAI({ apiKey: geminiApiKey });

// --- Mutation to start a new conversation ---
export const startConversation = mutation({
    handler: async (ctx): Promise<Id<"conversations">> => {
        const conversationId = await ctx.db.insert("conversations", {
            status: "ongoing",
            answers: {},
            dateIdeas: []
        });
        return conversationId;
    },
});

// --- Action to process answers and call Gemini ---
export const generateDateIdeas = action({
    args: {
        conversationId: v.id("conversations"),
        answers: v.record(v.string(), v.string()),
    },
    handler: async (ctx, args) => {
        // --- Check for Gemini API Key ---
        if (!geminiApiKey) {
            await ctx.runMutation(internal.conversations.updateConversationStatus, {
                conversationId: args.conversationId,
                status: "error",
            });
            throw new Error("Gemini API Key not configured. Cannot generate date ideas.");
        }

        // --- Update status to 'processing' ---
        await ctx.runMutation(internal.conversations.updateConversationStatus, {
            conversationId: args.conversationId,
            status: "processing",
        });

        // --- Construct prompt for Gemini ---
        let promptContent = "Generate 3 diverse and creative date ideas based on these user preferences:\n\n";
        for (const [promptId, answer] of Object.entries(args.answers)) {
            const questionText = backendPromptMap.get(promptId);
            promptContent += `- ${questionText}: ${answer}\n`;
        }
        promptContent += "\nFormat the output strictly as a JSON object containing a single key 'ideas' which is an array of objects. Each object in the array must have a 'title' (string) and a 'description' (string) key. Make sure the description is no more than 30 words. Example: {\"ideas\": [{\"title\": \"Example Date\", \"description\": \"Do this...\"}]}";

        try {
            // --- Call Gemini API ---
            const config = {
                responseMimeType: 'application/json',
            };
            const model = 'gemini-2.0-flash';
            const contents = [
                {
                    role: 'user',
                    parts: [
                        {
                            text: promptContent,
                        },
                    ],
                },
            ];
            const response = await genAI.models.generateContent({
                model,
                config,
                contents,
            });
            const resultText = response.text;

            if (!resultText) {
                throw new Error("Gemini returned an empty response.");
            }

            // --- Parse response ---
            let parsedIdeas = [];
            try {
                const jsonResponse = JSON.parse(resultText);
                // Expecting structure like: {"ideas": [...]} based on the prompt
                if (jsonResponse.ideas && Array.isArray(jsonResponse.ideas)) {
                    parsedIdeas = jsonResponse.ideas;
                } else {
                    console.error("Unexpected JSON structure from Gemini:", jsonResponse);
                    throw new Error("Could not parse 'ideas' array from Gemini JSON response.");
                }

                if (!parsedIdeas.every((idea: any): idea is { title: string; description: string } => typeof idea?.title === 'string' && typeof idea?.description === 'string')) {
                    console.error("Parsed ideas array contains invalid items:", parsedIdeas);
                    throw new Error("Parsed ideas lack required 'title' or 'description' string fields.");
                }

            } catch (parseError) {
                console.error("Error parsing Gemini response:", parseError, "\nResponse text:", resultText);
                throw new Error(`Failed to parse date ideas from Gemini JSON output.`);
            }

            // --- Save results ---
            await ctx.runMutation(internal.conversations.saveDateIdeas, {
                conversationId: args.conversationId,
                dateIdeas: parsedIdeas,
            });

        } catch (error: any) {
            console.error("Error calling Gemini API or processing results:", error);
            await ctx.runMutation(internal.conversations.updateConversationStatus, {
                conversationId: args.conversationId,
                status: "error",
            });
            throw new Error(`Gemini API interaction failed: ${error.message || error}`);
        }
    },
});

// --- Internal Mutation to save results and update status ---
export const saveDateIdeas = internalMutation({
    args: {
        conversationId: v.id("conversations"),
        dateIdeas: v.array(v.object({ title: v.string(), description: v.string() })),
    },
    handler: async (ctx, args) => {
        if (!args.dateIdeas.every(idea => typeof idea?.title === 'string' && typeof idea?.description === 'string')) {
            console.error("Attempted to save invalid date ideas structure:", args.dateIdeas);
        }
        await ctx.db.patch(args.conversationId, {
            dateIdeas: args.dateIdeas,
            status: "completed",
        });
    },
});

// --- Internal Mutation to update status ---
export const updateConversationStatus = internalMutation({
    args: {
        conversationId: v.id("conversations"),
        status: v.union(v.literal("processing"), v.literal("error")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.conversationId, { status: args.status });
    }
})

// --- Query to get conversation data ---
export const getConversation = query({
    args: {
        conversationId: v.optional(v.id("conversations")),
    },
    handler: async (ctx, args) => {
        if (!args.conversationId) {
            return null;
        }
        const conversation = await ctx.db.get(args.conversationId);
        return conversation;
    },
});