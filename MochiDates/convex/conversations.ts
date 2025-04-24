import { v } from "convex/values";
import {
    query,
    mutation,
    action,
    internalMutation,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";
import { backendPromptMap } from "./promptData";

const openAIKey = process.env.OPENAI_API_KEY;
if (!openAIKey) {
    console.warn("OPENAI_API_KEY environment variable not set!");
}

const openai = new OpenAI({ apiKey: openAIKey });

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

// --- Action to process answers and call OpenAI ---
export const generateDateIdeas = action({
    args: {
        conversationId: v.id("conversations"),
        answers: v.record(v.string(), v.string()),
    },
    handler: async (ctx, args) => {
        //     if (!openAIKey) {
        //         await ctx.runMutation(internal.conversations.updateConversationStatus, {
        //             conversationId: args.conversationId,
        //             status: "error",
        //         });
        //         throw new Error("OpenAI API Key not configured. Cannot generate date ideas.");
        //     }

        //     // --- Update status to 'processing' ---
        //     await ctx.runMutation(internal.conversations.updateConversationStatus, {
        //         conversationId: args.conversationId,
        //         status: "processing",
        //     });

        //     // --- Construct prompt for OpenAI ---
        //     let promptContent = "Generate 3 diverse and creative date ideas based on these user preferences:\n\n";
        // for (const [promptId, answer] of Object.entries(args.answers)) {
        //     const questionText = backendPromptMap.get(promptId);
        //     if (questionText) {
        //         promptContent += `- ${questionText}: ${answer}\n`;
        //     } else {
        //         promptContent += `- Preference (ID ${promptId}): ${answer}\n`;
        //         console.warn(`Backend prompt text not found for ID: ${promptId}. Is convex/promptData.ts synced?`);
        //     }
        // }
        // promptContent += "\nFormat the output as a JSON array of objects, where each object has a 'title' and a 'description' key. Ensure the response is valid JSON. Example: [{'title': 'Example Date', 'description': 'Do this...'}]";

        //     try {
        //         // --- Call OpenAI API ---
        //         const response = await openai.chat.completions.create({
        //             model: "o4-mini-2025-04-16",
        //             messages: [
        //                 { role: "system", content: "You are a helpful assistant that suggests creative date ideas." },
        //                 { role: "user", content: promptContent },
        //             ],
        //             response_format: { type: "json_object" },
        //         });

        //         const resultText = response.choices[0]?.message?.content;

        //         if (!resultText) {
        //             throw new Error("OpenAI returned an empty response.");
        //         }

        //         // --- Parse response ---
        //         // Assuming OpenAI returns a JSON string like: '{"ideas": [{"title": "...", "description": "..."}, ...]}'
        //         // Adjust parsing based on the actual structure you get or request.
        //         let parsedIdeas = [];
        //         try {
        //             // Try parsing assuming the response is directly the JSON array or an object containing it
        //             const jsonResponse = JSON.parse(resultText);
        //             // Adapt this based on actual OpenAI response structure. Maybe it's jsonResponse.ideas?
        //             if (Array.isArray(jsonResponse)) {
        //                 parsedIdeas = jsonResponse;
        //             } else if (jsonResponse.ideas && Array.isArray(jsonResponse.ideas)) {
        //                 parsedIdeas = jsonResponse.ideas;
        //             } else {
        //                 console.error("Unexpected JSON structure from OpenAI:", jsonResponse);
        //                 throw new Error("Could not parse date ideas from OpenAI response.");
        //             }

        //             if (!parsedIdeas.every((idea: { title: any; description: any; }) => idea.title && idea.description)) {
        //                 throw new Error("Parsed ideas lack required 'title' or 'description' fields.");
        //             }

        //         } catch (parseError) {
        //             console.error("Error parsing OpenAI response:", parseError, "\nResponse text:", resultText);
        //             throw new Error(`Failed to parse date ideas from OpenAI`);
        //         }


        // --- Save results ---
        const sampleDateIdeas = [
            {
                title: "Gardens by the Bay Stroll & Light Show",
                description: "Take a romantic evening walk through the Supertree Grove and Cloud Forest dome at Gardens by the Bay, ending with the spectacular Garden Rhapsody light and sound show.",
            },
            {
                title: "Katong Antique House & Peranakan Food Trail",
                description: "Explore the unique Peranakan culture with a visit to the Katong Antique House, followed by a delicious food adventure trying local delights like Laksa or Kueh Chang in the Joo Chiat/Katong area.",
            },
            {
                title: "ArtScience Museum & Marina Bay Sands View",
                description: "Visit an inspiring exhibition at the ArtScience Museum, then head up to the Marina Bay Sands Skypark Observation Deck for breathtaking panoramic views of the Singapore skyline.",
            },
            {
                title: "Digicam Hunting & Cafe Hopping in Tiong Bahru",
                description: "Explore the charming Tiong Bahru neighbourhood with your digital cameras, capturing its unique architecture. Refuel and compare shots at one of the many trendy cafes.",
            }
        ];
        
        await ctx.runMutation(internal.conversations.saveDateIdeas, {
            conversationId: args.conversationId,
            // dateIdeas: parsedIdeas,
            dateIdeas: sampleDateIdeas,
        });

        console.log("Successfully generated and saved date ideas for conversation:", args.conversationId);

        // } catch (error) {
        //     console.error("Error calling OpenAI or processing results:", error);
        //     // --- Update status to 'error' on failure ---
        //     await ctx.runMutation(internal.conversations.updateConversationStatus, {
        //         conversationId: args.conversationId,
        //         status: "error",
        //     });
        //     throw error;
        // }
    },
});

// --- Internal Mutation to save results and update status ---
export const saveDateIdeas = internalMutation({
    args: {
        conversationId: v.id("conversations"),
        dateIdeas: v.array(v.object({ title: v.string(), description: v.string() })),
    },
    handler: async (ctx, args) => {
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