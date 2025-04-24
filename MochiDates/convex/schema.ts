import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    // User's Answers
    answers: v.optional(v.object({})), // { promptId1: answer1, promptId2: answer2, ... }

    // OpenAI Date Ideas
    dateIdeas: v.optional(v.array(v.object({
      title: v.string(),
      description: v.string(),
      // TODO: add more (places, etc.)
    }))),

    // Conversation Status
    status: v.union(
      v.literal("ongoing"),     // still answering questions
      v.literal("processing"),  // answers submitted, waiting for OpenAI
      v.literal("completed"),   // OpenAI response received and stored
      v.literal("error")        // error occurred during processing
    ),
  })
});