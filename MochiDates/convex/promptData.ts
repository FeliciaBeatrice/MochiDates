// IMPORTANT: This is a COPY of the data from frontend's data/prompts.ts
// MUST keep this manually synchronized with the frontend version

interface BackendPrompt {
    id: number;
    message: string;
}

export const backendPrompts: ReadonlyArray<BackendPrompt> = [
    {
        id: 1,
        message: "Hi! I'm Mochi, your date planner 💖 Ready to plan the perfect date?",
    },
    {
        id: 2,
        message: "What kind of vibe are you in the mood for?",
    },
    {
        id: 3,
        message: "Sounds great! Let's set the mood. Indoor or outdoor?",
    },
    {
        id: 4,
        message: "Any budget in mind?",
    },
    {
        id: 5,
        message: "Where are you located?",
    },
    {
        id: 6,
        message: "Is this for a special occasion (birthday/anniversary/etc.)?",
    },
    {
        id: 7,
        message: "Anything else you wanna tell me? You can be as specific as you want!",
    },
];

export const backendPromptMap: ReadonlyMap<string, string> = new Map(
    backendPrompts.map(p => [String(p.id), p.message])
);